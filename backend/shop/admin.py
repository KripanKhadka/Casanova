from django.contrib import admin
from .models import Order, OrderItem, Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'sku')
    list_filter = ('category',)
    search_fields = ('name', 'sku')
    prepopulated_fields = {'id': ('name',)}


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'product_name', 'color', 'quantity', 'unit_price')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'total', 'status', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('email', 'first_name', 'last_name', 'transaction_uuid')
    readonly_fields = ('created_at', 'transaction_uuid', 'subtotal', 'shipping', 'total')
    inlines = [OrderItemInline]
