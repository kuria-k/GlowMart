from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
import uuid

class Order(models.Model):
    # Separate status choices
    ORDER_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("canceled", "Canceled"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("payment_pending", "Payment Pending"),
        ("payment_completed", "Payment Completed"),
        ("payment_failed", "Payment Failed"),
    ]

    PAYMENT_METHODS = [
        ("mpesa", "M-PESA"),
        ("cash", "Cash on Delivery"),
        ("card", "Card Payment"),
    ]

    # =========================
    # ORDER IDENTIFICATION
    # =========================
    order_number = models.CharField(max_length=50, unique=True, blank=True)

    # =========================
    # CUSTOMER INFO
    # =========================
    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders",
        null=True,
        blank=True
    )
    customer_name = models.CharField(max_length=255, blank=True, null=True, default='Guest')
    customer_email = models.EmailField(blank=True, null=True, default='guest@example.com')
    customer_phone = models.CharField(max_length=20, blank=True, null=True, default='0000000000')

    # =========================
    # DELIVERY INFO
    # =========================
    delivery_address = models.TextField(blank=True, null=True, default='No address provided')
    delivery_city = models.CharField(max_length=100, blank=True, null=True, default='Nairobi')
    delivery_area = models.CharField(max_length=100, blank=True, default='')
    delivery_zone = models.CharField(max_length=50, blank=True, default='')
    special_instructions = models.TextField(blank=True, default='')

    # =========================
    # AMOUNTS
    # =========================
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, default=0)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, default=0)

    # =========================
    # PAYMENT
    # =========================
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default="mpesa")
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default="pending")
    order_status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default="pending")

    # =========================
    # M-PESA FIELDS
    # =========================
    mpesa_transaction_id = models.CharField(max_length=100, blank=True, null=True)
    mpesa_checkout_id = models.CharField(max_length=100, blank=True, null=True)
    mpesa_receipt_number = models.CharField(max_length=50, blank=True, null=True)

    # =========================
    # TIMESTAMPS
    # =========================
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['customer_phone']),
            models.Index(fields=['payment_status']),
        ]

    def __str__(self):
        return f"{self.order_number or 'Order'} - {self.customer_name or 'Guest'}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            year = datetime.now().strftime("%y")
            last_order = Order.objects.filter(order_number__startswith=f"GM{year}").order_by('-id').first()
            if last_order and last_order.order_number:
                try:
                    last_num = int(last_order.order_number[4:])
                    next_num = last_num + 1
                except (ValueError, IndexError):
                    next_num = 1
            else:
                next_num = 1
            self.order_number = f"GM{year}{str(next_num).zfill(5)}"
        
        # Ensure required fields have defaults
        if not self.customer_name:
            self.customer_name = 'Guest'
        if not self.customer_email:
            self.customer_email = 'guest@example.com'
        if not self.customer_phone:
            self.customer_phone = '0000000000'
        if not self.delivery_address:
            self.delivery_address = 'No address provided'
        if not self.delivery_city:
            self.delivery_city = 'Nairobi'
        if self.subtotal is None:
            self.subtotal = 0
        if self.total_amount is None:
            self.total_amount = 0
        
        super().save(*args, **kwargs)

    @classmethod
    def get_or_create_dummy_customer(cls):
        """Get or create a dummy customer for guest orders"""
        dummy, created = User.objects.get_or_create(
            username="dummy_customer",
            defaults={
                "email": "dummy@example.com",
                "first_name": "Guest",
                "last_name": "User"
            }
        )
        if created:
            dummy.set_password("dummy_password_123")
            dummy.save()
        return dummy


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey('inventory.Product', on_delete=models.CASCADE, null=True, blank=True)

    product_name = models.CharField(max_length=255, blank=True, null=True, default='Product')
    product_sku = models.CharField(max_length=100, blank=True, default='')

    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    image_url = models.URLField(blank=True, null=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"

    def save(self, *args, **kwargs):
        self.total = self.price * self.quantity
        super().save(*args, **kwargs)