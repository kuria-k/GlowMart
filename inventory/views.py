from rest_framework import viewsets
from .models import Product, Category, Supplier
from .serializers import ProductSerializer, CategorySerializer, SupplierSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        # Allow anyone to view products (list and retrieve)
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        # Require authentication for create, update, delete
        return [IsAuthenticated()]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        # Allow anyone to view categories (list and retrieve)
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        # Require authentication for create, update, delete
        return [IsAuthenticated()]


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    
    def get_permissions(self):
        # Allow anyone to view suppliers (list and retrieve)
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        # Require authentication for create, update, delete
        return [IsAuthenticated()]
    
# inventory/views.py - Add this method to your ProductViewSet



class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'check_stock']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=True, methods=['get'])
    def check_stock(self, request, pk=None):
        """Check if requested quantity is available"""
        product = self.get_object()
        quantity = int(request.query_params.get('quantity', 1))
        
        available = product.stock >= quantity
        available_stock = product.stock
        
        return Response({
            'available': available,
            'available_stock': available_stock,
            'requested_quantity': quantity,
            'message': f'Only {available_stock} left in stock' if not available else 'In stock'
        })