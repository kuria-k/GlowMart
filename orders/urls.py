# # orders/urls.py (using ViewSets)
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from . import views

# # Create router
# router = DefaultRouter()
# router.register(r'orders', views.OrderViewSet, basename='order')
# router.register(r'order-items', views.OrderItemViewSet, basename='order-item')

# urlpatterns = [
#     path('', include(router.urls)),
# ]

# orders/urls.py
# orders/urls.py
# orders/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Order endpoints
    path('', views.OrderListCreateView.as_view(), name='order-list-create'),
    path('<int:id>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('<int:id>/update-status/', views.UpdateOrderStatusView.as_view(), name='update-order-status'),
    path('<int:id>/update-payment/', views.UpdatePaymentStatusView.as_view(), name='update-payment-status'),
    path('track/', views.TrackOrderView.as_view(), name='track-order'),
    path('<int:order_id>/items/', views.OrderItemListCreateView.as_view(), name='order-items-list-create'),
]