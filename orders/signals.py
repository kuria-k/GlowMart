# orders/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import OrderItem

@receiver(post_save, sender=OrderItem)
def reduce_stock_on_create(sender, instance, created, **kwargs):
    """Reduce stock when an order item is created"""
    if created and instance.product:  # Only if product exists
        try:
            instance.product.stock -= instance.quantity
            instance.product.save()
            print(f"✅ Stock reduced for {instance.product.name}: -{instance.quantity}")
        except Exception as e:
            print(f"❌ Error reducing stock: {e}")

@receiver(post_delete, sender=OrderItem)
def restore_stock_on_delete(sender, instance, **kwargs):
    """Restore stock when an order item is deleted"""
    if instance.product:  # Only if product exists
        try:
            instance.product.stock += instance.quantity
            instance.product.save()
            print(f"✅ Stock restored for {instance.product.name}: +{instance.quantity}")
        except Exception as e:
            print(f"❌ Error restoring stock: {e}")
