from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from notifications.models import Notification
from .models import Product  # safe here, because it's not inside models.py

@receiver(post_save, sender=Product)
def notify_low_stock(sender, instance, **kwargs):
    if instance.stock < 5:  # threshold
        admins = User.objects.filter(is_staff=True)
        for admin in admins:
            Notification.objects.create(
                user=admin,
                message=f"Stock alert: {instance.name} has only {instance.stock} left.",
                type="stock"
            )
