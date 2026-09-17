from django.db import models


class Product(models.Model):
    id = models.SlugField(primary_key=True)
    name = models.CharField(max_length=160)
    category = models.CharField(max_length=80)
    price = models.PositiveIntegerField()
    material = models.CharField(max_length=255)
    dimensions = models.CharField(max_length=255)
    sku = models.CharField(max_length=40, unique=True)
    colors = models.JSONField(default=list)
    image = models.URLField()
    gallery = models.JSONField(default=list)
    description = models.TextField()
    stock = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['id']


class Order(models.Model):
    STATUS_CHOICES = [('pending', 'Pending payment'), ('paid', 'Paid'), ('failed', 'Payment failed')]

    email = models.EmailField()
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=80)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    payment_method = models.CharField(max_length=30)
    subtotal = models.PositiveIntegerField()
    shipping = models.PositiveIntegerField(default=45)
    total = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transaction_uuid = models.CharField(max_length=80, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    product_name = models.CharField(max_length=160)
    color = models.CharField(max_length=20)
    quantity = models.PositiveIntegerField()
    unit_price = models.PositiveIntegerField()
