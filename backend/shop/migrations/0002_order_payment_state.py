from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('shop', '0001_initial')]

    operations = [
        migrations.AddField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending payment'), ('paid', 'Paid'), ('failed', 'Payment failed')], default='pending', max_length=20),
        ),
        migrations.AddField(
            model_name='order',
            name='transaction_uuid',
            field=models.CharField(blank=True, max_length=80, null=True, unique=True),
        ),
    ]
