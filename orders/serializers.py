# from rest_framework import serializers
# from .models import Order, OrderItem
# from inventory.serializers import ProductSerializer
# from rest_framework import serializers
# from .models import Order, OrderItem

# class OrderItemSerializer(serializers.ModelSerializer):
#     product_detail = ProductSerializer(source="product", read_only=True)

#     class Meta:
#         model = OrderItem
#         fields = ["id", "order", "product", "product_detail", "quantity", "price"]


# # class OrderSerializer(serializers.ModelSerializer):
# #     items = OrderItemSerializer(many=True, read_only=True)

# #     class Meta:
# #         model = Order
# #         fields = ["id", "customer", "status", "created_at", "updated_at", "items"]



# class OrderSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Order
#         fields = ["id", "customer", "status", "created_at", "updated_at", "items"]
#         read_only_fields = ["created_at", "updated_at"]

#     def create(self, validated_data):
#         # If no customer is provided, use dummy
#         if "customer" not in validated_data:
#             validated_data["customer"] = Order.get_or_create_dummy_customer()
#         return super().create(validated_data)

# # orders/serializers.py
# from rest_framework import serializers
# from .models import Order, OrderItem

# class OrderItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = OrderItem
#         fields = [
#             'id', 'order', 'product', 'product_name', 'product_sku',
#             'quantity', 'price', 'total', 'image_url'
#         ]
#         read_only_fields = ['total']


# class OrderSerializer(serializers.ModelSerializer):
#     items = OrderItemSerializer(many=True, read_only=True)
    
#     class Meta:
#         model = Order
#         fields = [
#             'id', 'order_number', 'customer', 'customer_name', 'customer_email',
#             'customer_phone', 'delivery_address', 'delivery_city', 'delivery_area',
#             'delivery_zone', 'special_instructions', 'subtotal', 'shipping_cost',
#             'total_amount', 'payment_method', 'payment_status', 'order_status',
#             'mpesa_transaction_id', 'mpesa_checkout_id', 'mpesa_receipt_number',
#             'created_at', 'updated_at', 'paid_at', 'items'
#         ]
#         read_only_fields = ['id', 'order_number', 'created_at', 'updated_at', 'paid_at']
    
#     def update(self, instance, validated_data):
#         """Handle partial updates - only update fields that are provided"""
#         # Remove items from validated_data if present (don't update items through order endpoint)
#         validated_data.pop('items', None)
        
#         # Only update fields that are in validated_data
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
        
#         # If payment status changes to completed, set paid_at
#         if 'payment_status' in validated_data and validated_data['payment_status'] == 'payment_completed':
#             from django.utils import timezone
#             instance.paid_at = timezone.now()
        
#         instance.save()
#         return instance


from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id', 'order', 'product', 'product_name', 'product_sku',
            'quantity', 'price', 'total', 'image_url'
        ]
        read_only_fields = ['total']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    items_data = serializers.ListField(write_only=True, required=False)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer', 'customer_name', 'customer_email',
            'customer_phone', 'delivery_address', 'delivery_city', 'delivery_area',
            'delivery_zone', 'special_instructions', 'subtotal', 'shipping_cost',
            'total_amount', 'payment_method', 'payment_status', 'order_status',
            'mpesa_transaction_id', 'mpesa_checkout_id', 'mpesa_receipt_number',
            'created_at', 'updated_at', 'paid_at', 'items', 'items_data'
        ]
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at', 'paid_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items_data', [])
        
        # Create dummy customer if needed
        if "customer" not in validated_data or not validated_data.get("customer"):
            validated_data["customer"] = Order.get_or_create_dummy_customer()
        
        # Set defaults for required fields
        validated_data.setdefault('customer_name', 'Guest')
        validated_data.setdefault('customer_email', 'guest@example.com')
        validated_data.setdefault('customer_phone', '0000000000')
        validated_data.setdefault('delivery_address', 'No address provided')
        validated_data.setdefault('delivery_city', 'Nairobi')
        validated_data.setdefault('subtotal', 0)
        validated_data.setdefault('total_amount', 0)
        
        # Create the order
        order = Order.objects.create(**validated_data)
        
        # Create order items
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order

    def update(self, instance, validated_data):
        """Handle partial updates"""
        validated_data.pop('items', None)
        validated_data.pop('items_data', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # If payment status changes to completed, set paid_at
        if validated_data.get('payment_status') == 'payment_completed' and not instance.paid_at:
            from django.utils import timezone
            instance.paid_at = timezone.now()
        
        instance.save()
        return instance