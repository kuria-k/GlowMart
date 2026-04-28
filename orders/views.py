# # orders/views.py (ViewSet version)
# from rest_framework import viewsets, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from django.db import transaction
# from django.utils import timezone
# from .models import Order, OrderItem
# from .serializers import OrderSerializer, OrderItemSerializer, OrderListSerializer

# class OrderViewSet(viewsets.ModelViewSet):
#     queryset = Order.objects.all()
#     serializer_class = OrderSerializer
    
#     def get_serializer_class(self):
#         if self.action == 'list':
#             return OrderListSerializer
#         return OrderSerializer
    
#     def get_queryset(self):
#         queryset = Order.objects.all()
        
#         # Filter by phone
#         phone = self.request.query_params.get('phone')
#         if phone:
#             queryset = queryset.filter(customer_phone__icontains=phone)
        
#         # Filter by order number
#         order_number = self.request.query_params.get('order_number')
#         if order_number:
#             queryset = queryset.filter(order_number__icontains=order_number)
        
#         # Filter by payment status
#         payment_status = self.request.query_params.get('payment_status')
#         if payment_status:
#             queryset = queryset.filter(payment_status=payment_status)
        
#         return queryset
    
#     @transaction.atomic
#     def create(self, request, *args, **kwargs):
#         """Create a new order with items"""
#         print("=" * 50)
#         print("Creating order with data:", request.data)
#         print("=" * 50)
        
#         serializer = self.get_serializer(data=request.data)
        
#         if serializer.is_valid():
#             order = serializer.save()
#             print(f"Order created: {order.order_number}")
#             return Response(
#                 self.get_serializer(order).data,
#                 status=status.HTTP_201_CREATED
#             )
#         else:
#             print("Validation errors:", serializer.errors)
#             return Response(
#                 serializer.errors,
#                 status=status.HTTP_400_BAD_REQUEST
#             )
    
#     @action(detail=True, methods=['patch'])
#     def update_status(self, request, pk=None):
#         """Update order status"""
#         order = self.get_object()
        
#         order_status = request.data.get('order_status')
#         payment_status = request.data.get('payment_status')
        
#         if order_status:
#             order.order_status = order_status
#         if payment_status:
#             order.payment_status = payment_status
        
#         order.save()
        
#         return Response({
#             'success': True,
#             'order_id': order.id,
#             'order_number': order.order_number,
#             'order_status': order.order_status,
#             'payment_status': order.payment_status
#         })
    
#     @action(detail=True, methods=['patch'])
#     def update_payment(self, request, pk=None):
#         """Update payment status (for M-PESA callback)"""
#         order = self.get_object()
        
#         payment_status = request.data.get('payment_status')
#         mpesa_transaction_id = request.data.get('mpesa_transaction_id')
#         mpesa_receipt_number = request.data.get('mpesa_receipt_number')
        
#         if payment_status:
#             order.payment_status = payment_status
        
#         if mpesa_transaction_id:
#             order.mpesa_transaction_id = mpesa_transaction_id
        
#         if mpesa_receipt_number:
#             order.mpesa_receipt_number = mpesa_receipt_number
        
#         if payment_status == 'payment_completed' and not order.paid_at:
#             order.paid_at = timezone.now()
        
#         order.save()
        
#         return Response({
#             'success': True,
#             'order_id': order.id,
#             'order_number': order.order_number,
#             'payment_status': order.payment_status,
#             'mpesa_receipt_number': order.mpesa_receipt_number
#         })
    
#     @action(detail=False, methods=['get'])
#     def by_phone(self, request):
#         """Get orders by phone number"""
#         phone = request.query_params.get('phone')
#         if not phone:
#             return Response(
#                 {'error': 'Phone number required'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         orders = Order.objects.filter(customer_phone__icontains=phone)
#         serializer = OrderListSerializer(orders, many=True)
#         return Response(serializer.data)
    
#     @action(detail=False, methods=['get'])
#     def by_order_number(self, request):
#         """Get order by order number"""
#         order_number = request.query_params.get('order_number')
#         if not order_number:
#             return Response(
#                 {'error': 'Order number required'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         try:
#             order = Order.objects.get(order_number=order_number)
#             serializer = self.get_serializer(order)
#             return Response(serializer.data)
#         except Order.DoesNotExist:
#             return Response(
#                 {'error': 'Order not found'},
#                 status=status.HTTP_404_NOT_FOUND
#             )


# class OrderItemViewSet(viewsets.ModelViewSet):
#     queryset = OrderItem.objects.all()
#     serializer_class = OrderItemSerializer
    
#     def get_queryset(self):
#         queryset = OrderItem.objects.all()
        
#         # Filter by order
#         order_id = self.request.query_params.get('order')
#         if order_id:
#             queryset = queryset.filter(order_id=order_id)
        
#         return queryset

# orders/views.py - Complete corrected version

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db import transaction
from django.utils import timezone
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from inventory.models import Product  # Import Product at the top


class OrderListCreateView(generics.ListCreateAPIView):
    """List all orders or create a new order with stock deduction"""
    permission_classes = [AllowAny]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        queryset = Order.objects.all()
        
        # Filter by phone number
        phone = self.request.query_params.get('phone')
        if phone:
            queryset = queryset.filter(customer_phone__icontains=phone)
        
        # Filter by order number
        order_number = self.request.query_params.get('order_number')
        if order_number:
            queryset = queryset.filter(order_number__icontains=order_number)
        
        # Filter by payment status
        payment_status = self.request.query_params.get('payment_status')
        if payment_status:
            queryset = queryset.filter(payment_status=payment_status)
        
        return queryset
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Create a new order with items and deduct stock"""
        print("=" * 50)
        print("Creating order with data:", request.data)
        print("=" * 50)
        
        # First, check if all items have sufficient stock
        items_data = request.data.get('items_data', [])
        stock_issues = []
        
        for item_data in items_data:
            product_id = item_data.get('product') or item_data.get('product_id')
            product_name = item_data.get('product_name')
            quantity = item_data.get('quantity', 1)
            
            # Try to find product by ID first, then by name
            product = None
            if product_id:
                try:
                    product = Product.objects.get(id=product_id)
                except Product.DoesNotExist:
                    pass
            
            if not product and product_name:
                product = Product.objects.filter(name__icontains=product_name).first()
            
            if product:
                if product.stock < quantity:
                    stock_issues.append({
                        'product': product.name,
                        'available': product.stock,
                        'requested': quantity
                    })
        
        # If there are stock issues, return error before creating order
        if stock_issues:
            print("❌ Stock issues detected:", stock_issues)
            return Response({
                'error': 'Insufficient stock for some items',
                'details': stock_issues
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Proceed with order creation
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            order = serializer.save()
            
            # Deduct stock for each item after order is created
            for item_data in items_data:
                product_id = item_data.get('product') or item_data.get('product_id')
                product_name = item_data.get('product_name')
                quantity = item_data.get('quantity', 1)
                
                # Find product by ID first, then by name
                product = None
                if product_id:
                    try:
                        product = Product.objects.get(id=product_id)
                    except Product.DoesNotExist:
                        pass
                
                if not product and product_name:
                    product = Product.objects.filter(name__icontains=product_name).first()
                
                if product:
                    # Deduct stock
                    product.stock -= quantity
                    product.save()
                    print(f"✅ Stock deducted for {product.name}: {quantity} (new stock: {product.stock})")
                else:
                    print(f"⚠️ Product not found in inventory: {product_name or product_id}")
            
            print(f"✅ Order created: {order.order_number}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("❌ Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# The rest of your views remain the same...
class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update or delete a specific order"""
    permission_classes = [AllowAny]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = 'id'


class UpdateOrderStatusView(APIView):
    """Update only the order status"""
    permission_classes = [AllowAny]
    
    def patch(self, request, id):
        try:
            order = Order.objects.get(id=id)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        new_status = request.data.get('order_status')
        
        if not new_status:
            return Response(
                {'error': 'order_status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.order_status = new_status
        order.save()
        
        return Response({
            'success': True,
            'id': order.id,
            'order_number': order.order_number,
            'order_status': order.order_status,
            'payment_status': order.payment_status
        })


class UpdatePaymentStatusView(APIView):
    """Update only the payment status"""
    permission_classes = [AllowAny]
    
    def patch(self, request, id):
        try:
            order = Order.objects.get(id=id)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        payment_status = request.data.get('payment_status')
        mpesa_receipt_number = request.data.get('mpesa_receipt_number')
        mpesa_transaction_id = request.data.get('mpesa_transaction_id')
        
        if payment_status:
            order.payment_status = payment_status
        
        if mpesa_receipt_number:
            order.mpesa_receipt_number = mpesa_receipt_number
        
        if mpesa_transaction_id:
            order.mpesa_transaction_id = mpesa_transaction_id
        
        if payment_status == 'payment_completed' and not order.paid_at:
            order.paid_at = timezone.now()
        
        order.save()
        
        return Response({
            'success': True,
            'id': order.id,
            'order_number': order.order_number,
            'payment_status': order.payment_status,
            'mpesa_receipt_number': order.mpesa_receipt_number
        })


class TrackOrderView(APIView):
    """Track order by order number or phone number"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        order_number = request.query_params.get('order_number')
        phone = request.query_params.get('phone')
        
        if order_number:
            try:
                order = Order.objects.get(order_number=order_number)
                serializer = OrderSerializer(order)
                return Response(serializer.data)
            except Order.DoesNotExist:
                return Response({'error': 'Order not found'}, status=404)
        
        if phone:
            orders = Order.objects.filter(customer_phone=phone)
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data)
        
        return Response({'error': 'Provide order_number or phone'}, status=400)


class OrderItemListCreateView(APIView):
    """List or create items for a specific order"""
    permission_classes = [AllowAny]
    
    def get(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
            items = order.items.all()
            serializer = OrderItemSerializer(items, many=True)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def post(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        data = request.data.copy()
        data['order'] = order_id
        
        serializer = OrderItemSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)