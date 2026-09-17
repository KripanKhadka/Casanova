from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.products),
    path('products/<slug:product_id>/', views.product_detail),
    path('orders/', views.create_order),
    path('payments/esewa/success/', views.esewa_success),
    path('payments/esewa/failure/', views.esewa_failure),
]
