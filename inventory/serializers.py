# from rest_framework import serializers
# from .models import Product, Category, Supplier

# class CategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Category
#         fields = "__all__"


# class SupplierSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Supplier
#         fields = "__all__"


# class ProductSerializer(serializers.ModelSerializer):
#     # Accept IDs when creating/updating
#     category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
#     supplier = serializers.PrimaryKeyRelatedField(queryset=Supplier.objects.all(), allow_null=True)

#     # Show nested details when reading
#     category_detail = CategorySerializer(source="category", read_only=True)
#     supplier_detail = SupplierSerializer(source="supplier", read_only=True)

#     class Meta:
#         model = Product
#         fields = [
#             "id",
#             "name",
#             "category",        # for POST/PUT (dropdown ID)
#             "category_detail", # for GET (nested info)
#             "supplier",
#             "supplier_detail",
#             "description",
#             "price",
#             "stock",
#             "expiry_date",
#             "image",
#             "created_at",
#         ]

from rest_framework import serializers
from .models import Product, Category, Supplier, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = "__all__"


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "caption"]


class ProductSerializer(serializers.ModelSerializer):
    # Writable relations
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    supplier = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(), allow_null=True, required=False
    )

    # Read-only nested details
    category_detail = CategorySerializer(source="category", read_only=True)
    supplier_detail = SupplierSerializer(source="supplier", read_only=True)

    # Images
    extra_images = ProductImageSerializer(many=True, read_only=True)
    new_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    # ✅ FIXED: Discount fields are now writable
    discount_percent = serializers.IntegerField(required=False, default=0)
    discount_expiry = serializers.DateTimeField(required=False, allow_null=True)

    # Computed fields
    current_price = serializers.SerializerMethodField()
    is_discount_active = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "category",
            "category_detail",
            "supplier",
            "supplier_detail",
            "description",
            "price",
            "current_price",
            "is_discount_active",
            "discount_percent",
            "discount_expiry",
            "stock",
            "expiry_date",
            "image",
            "extra_images",
            "new_images",
            "created_at",
        ]

    # -------------------
    # Computed methods
    # -------------------
    def get_current_price(self, obj):
        return obj.current_price

    def get_is_discount_active(self, obj):
        return obj.is_discount_active

    # -------------------
    # Validation
    # -------------------
    def validate_discount_percent(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Discount must be between 0 and 100."
            )
        return value

    def validate(self, data):
        discount = data.get("discount_percent", 0)
        expiry = data.get("discount_expiry")

        if discount > 0 and not expiry:
            raise serializers.ValidationError(
                "Discount expiry must be set when discount_percent > 0."
            )

        return data

    # -------------------
    # Create & Update
    # -------------------
    def create(self, validated_data):
        new_images = validated_data.pop("new_images", [])
        product = super().create(validated_data)

        for img in new_images:
            ProductImage.objects.create(product=product, image=img)

        return product

    def update(self, instance, validated_data):
        new_images = validated_data.pop("new_images", [])
        product = super().update(instance, validated_data)

        for img in new_images:
            ProductImage.objects.create(product=product, image=img)

        return product