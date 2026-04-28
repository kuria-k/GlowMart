

# # mpesa/urls.py
# from django.urls import path
# from . import views

# urlpatterns = [
#     path('initiate/', views.initiate_payment, name='initiate_payment'),
#     path('callback/', views.mpesa_callback, name='mpesa_callback'),
#     path('status/<str:checkout_id>/', views.check_payment_status, name='check_status'),
#     path('cancel/<str:checkout_id>/', views.cancel_payment, name='cancel_payment'),
#     path('transactions/', views.get_transactions, name='transactions'),
#     path('test-cors/', views.test_cors, name='test_cors'),  # Add test endpoint
# ]
from django.urls import path
from . import views

urlpatterns = [
    path('initiate/', views.initiate_payment, name='initiate_payment'),
    path('callback/', views.mpesa_callback, name='mpesa_callback'),
    path('status/<str:checkout_id>/', views.check_payment_status, name='check_status'),
]