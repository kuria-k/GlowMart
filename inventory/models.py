# from django.db import models

# class Category(models.Model):
#     name = models.CharField(max_length=100, unique=True)
#     description = models.TextField(blank=True)

#     def __str__(self):
#         return self.name


# class Supplier(models.Model):
#     name = models.CharField(max_length=150)
#     contact_person = models.CharField(max_length=150, blank=True)
#     contact_email = models.EmailField(blank=True)
#     phone = models.CharField(max_length=20, blank=True)
#     address = models.TextField(blank=True)
#     notes = models.TextField(blank=True)

#     def __str__(self):
#         return self.name


# class Product(models.Model):
#     name = models.CharField(max_length=200)
#     category = models.ForeignKey("Category", on_delete=models.CASCADE, related_name="products")
#     supplier = models.ForeignKey("Supplier", on_delete=models.SET_NULL, null=True, blank=True)
#     description = models.TextField(blank=True)
#     price = models.DecimalField(max_digits=10, decimal_places=2)
#     stock = models.PositiveIntegerField()
#     expiry_date = models.DateField(null=True, blank=True)
#     image = models.ImageField(upload_to="products/", null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.name

from django.db import models
from django.utils import timezone
from decimal import Decimal  # ✅ IMPORTANT


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Supplier(models.Model):
    name = models.CharField(max_length=150)
    contact_person = models.CharField(max_length=150, blank=True)
    contact_email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey("Category", on_delete=models.CASCADE, related_name="products")
    supplier = models.ForeignKey("Supplier", on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    expiry_date = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to="products/", null=True, blank=True)

    # ----- Discount Fields -----
    discount_percent = models.PositiveIntegerField(default=0)  # 0-100%
    discount_expiry = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    # ✅ FIXED: Proper Decimal calculation
    @property
    def current_price(self):
        """
        Returns the discounted price if discount is active, else regular price.
        """
        if self.is_discount_active:
            return (
                self.price
                * (Decimal("100") - Decimal(self.discount_percent))
                / Decimal("100")
            )
        return self.price

    @property
    def is_discount_active(self):
        """
        Returns True if discount is currently active.
        """
        return (
            self.discount_percent > 0
            and self.discount_expiry
            and timezone.now() <= self.discount_expiry
        )


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name="extra_images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="products/")
    caption = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.product.name} - Extra Image {self.id}"