import base64
import binascii
from decimal import Decimal, InvalidOperation
import hashlib
import hmac
import json
import urllib.request
from uuid import uuid4
from django.db import transaction
from django.http import JsonResponse
from django.conf import settings
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from .models import Order, OrderItem, Product

SHIPPING = 45


def api_response(data, status=200):
    response = JsonResponse(data, status=status, safe=isinstance(data, dict))
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Headers'] = 'Content-Type'
    response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response


def product_data(product):
    return {
        'id': product.id,
        'name': product.name,
        'category': product.category,
        'price': product.price,
        'material': product.material,
        'dimensions': product.dimensions,
        'sku': product.sku,
        'colors': product.colors,
        'image': product.image,
        'gallery': product.gallery,
        'description': product.description,
        'stock': product.stock,
    }


def products(request):
    if request.method == 'OPTIONS':
        return api_response({}, status=204)
    if request.method != 'GET':
        return api_response({'error': 'Method not allowed.'}, status=405)
    items = [product_data(product) for product in Product.objects.all()]
    categories = sorted({product['category'] for product in items})
    return api_response({'products': items, 'categories': categories})


def product_detail(request, product_id):
    if request.method == 'OPTIONS':
        return api_response({}, status=204)
    if request.method != 'GET':
        return api_response({'error': 'Method not allowed.'}, status=405)
    try:
        product = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return api_response({'error': 'Product not found.'}, status=404)
    return api_response(product_data(product))


def sign_esewa(fields):
    message = ','.join(f'{name}={fields[name]}' for name in fields)
    digest = hmac.new(settings.ESEWA_SECRET_KEY.encode(), message.encode(), hashlib.sha256).digest()
    return base64.b64encode(digest).decode()


def release_reserved_stock(order):
    for item in order.items.select_related('product'):
        item.product.stock += item.quantity
        item.product.save(update_fields=['stock'])


@csrf_exempt
def create_order(request):
    if request.method == 'OPTIONS':
        return api_response({}, status=204)
    if request.method != 'POST':
        return api_response({'error': 'Method not allowed.'}, status=405)

    try:
        payload = json.loads(request.body)
        customer = payload['customer']
        items = payload['items']
        payment_method = payload['payment_method']
    except (KeyError, TypeError, json.JSONDecodeError):
        return api_response({'error': 'Invalid order payload.'}, status=400)

    required_customer_fields = ('email', 'first_name', 'last_name', 'address', 'city', 'postal_code')
    if payment_method != 'esewa' or not isinstance(customer, dict) or not isinstance(items, list) or not items or any(not customer.get(field) for field in required_customer_fields):
        return api_response({'error': 'Customer details and at least one item are required.'}, status=400)

    try:
        with transaction.atomic():
            products_by_id = {product.id: product for product in Product.objects.select_for_update().filter(
                id__in=[item.get('product_id') for item in items]
            )}
            validated_items = []
            subtotal = 0
            for item in items:
                product = products_by_id.get(item.get('product_id'))
                quantity = int(item.get('quantity', 0))
                if not product or quantity < 1 or quantity > product.stock:
                    return api_response({'error': f"'{item.get('product_id')}' is unavailable in that quantity."}, status=400)
                color = item.get('color', '')
                if color not in product.colors:
                    return api_response({'error': f"Invalid finish for '{product.name}'."}, status=400)
                validated_items.append((product, color, quantity))
                subtotal += product.price * quantity

            transaction_uuid = f'FORM-{uuid4().hex[:24]}'
            order = Order.objects.create(
                email=customer['email'], first_name=customer['first_name'], last_name=customer['last_name'],
                address=customer['address'], city=customer['city'], postal_code=customer['postal_code'],
                payment_method='esewa', subtotal=subtotal, total=subtotal + SHIPPING,
                transaction_uuid=transaction_uuid,
            )
            for product, color, quantity in validated_items:
                OrderItem.objects.create(order=order, product=product, product_name=product.name,
                                         color=color, quantity=quantity, unit_price=product.price)
                product.stock -= quantity
                product.save(update_fields=['stock'])
    except (ValueError, KeyError):
        return api_response({'error': 'Invalid order payload.'}, status=400)

    signed_fields = {
        'total_amount': str(order.total),
        'transaction_uuid': order.transaction_uuid,
        'product_code': settings.ESEWA_PRODUCT_CODE,
    }
    payment_fields = {
        'amount': str(order.subtotal),
        'tax_amount': '0',
        'product_service_charge': '0',
        'product_delivery_charge': str(order.shipping),
        **signed_fields,
        'signed_field_names': ','.join(signed_fields),
        'signature': sign_esewa(signed_fields),
        'success_url': f'{settings.BACKEND_URL}/api/payments/esewa/success/',
        'failure_url': f'{settings.BACKEND_URL}/api/payments/esewa/failure/',
    }
    return api_response({'id': order.id, 'total': order.total, 'status': order.status,
                         'payment_url': settings.ESEWA_PAYMENT_URL, 'payment_fields': payment_fields}, status=201)


def parse_esewa_response(request):
    encoded = request.GET.get('data')
    if encoded:
        try:
            return json.loads(base64.b64decode(encoded).decode())
        except (binascii.Error, ValueError, UnicodeDecodeError, json.JSONDecodeError):
            return {}
    return {key: request.GET.get(key) for key in request.GET}


def verify_esewa_signature(response_data):
    signed_field_names = response_data.get('signed_field_names', '')
    if not signed_field_names or not response_data.get('signature'):
        return False

    signed_fields = {
        field_name: str(response_data.get(field_name, ''))
        for field_name in signed_field_names.split(',')
    }
    expected_signature = sign_esewa(signed_fields)
    return hmac.compare_digest(response_data['signature'], expected_signature)


def mark_order_failed(order):
    if order.status == 'pending':
        release_reserved_stock(order)
        order.status = 'failed'
        order.save(update_fields=['status'])


def esewa_success(request):
    response_data = parse_esewa_response(request)
    transaction_uuid = response_data.get('transaction_uuid') or request.GET.get('order')
    try:
        order = Order.objects.get(transaction_uuid=transaction_uuid)
    except Order.DoesNotExist:
        return redirect(f'{settings.FRONTEND_URL}/payment-failed')

    signature_valid = verify_esewa_signature(response_data)
    total_amount = str(response_data.get('total_amount', ''))
    try:
        amount_valid = Decimal(total_amount.replace(',', '')) == Decimal(order.total)
    except InvalidOperation:
        amount_valid = False
    status_valid = response_data.get('status') == 'COMPLETE'

    if signature_valid and amount_valid and status_valid:
        order.status = 'paid'
        order.save(update_fields=['status'])
        return redirect(f'{settings.FRONTEND_URL}/payment-success?order={order.transaction_uuid}')

    mark_order_failed(order)
    return redirect(f'{settings.FRONTEND_URL}/payment-failed?order={order.transaction_uuid}')


def esewa_failure(request):
    transaction_uuid = request.GET.get('transaction_uuid') or request.GET.get('order')
    if transaction_uuid:
        try:
            mark_order_failed(Order.objects.get(transaction_uuid=transaction_uuid))
        except Order.DoesNotExist:
            pass
    return redirect(f'{settings.FRONTEND_URL}/payment-failed?order={transaction_uuid or ""}')
