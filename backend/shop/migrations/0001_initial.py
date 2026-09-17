from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.SlugField(max_length=50, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=160)),
                ('category', models.CharField(max_length=80)),
                ('price', models.PositiveIntegerField()),
                ('material', models.CharField(max_length=255)),
                ('dimensions', models.CharField(max_length=255)),
                ('sku', models.CharField(max_length=40, unique=True)),
                ('colors', models.JSONField(default=list)),
                ('image', models.URLField()),
                ('gallery', models.JSONField(default=list)),
                ('description', models.TextField()),
                ('stock', models.PositiveIntegerField(default=0)),
            ],
            options={'ordering': ['id']},
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
                ('first_name', models.CharField(max_length=80)),
                ('last_name', models.CharField(max_length=80)),
                ('address', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=100)),
                ('postal_code', models.CharField(max_length=20)),
                ('payment_method', models.CharField(max_length=30)),
                ('subtotal', models.PositiveIntegerField()),
                ('shipping', models.PositiveIntegerField(default=45)),
                ('total', models.PositiveIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_name', models.CharField(max_length=160)),
                ('color', models.CharField(max_length=20)),
                ('quantity', models.PositiveIntegerField()),
                ('unit_price', models.PositiveIntegerField()),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='shop.order')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='shop.product')),
            ],
        ),
    ]
