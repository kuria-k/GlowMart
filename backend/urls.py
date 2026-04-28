# backend/urls.py
from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

# Simple home view
def home_view(request):
    return HttpResponse("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Glowmart API</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            h1 { color: #2c2c2c; }
            .status { color: green; }
            .endpoints { background: #f5f5f5; padding: 20px; border-radius: 10px; }
            code { background: #e0e0e0; padding: 2px 5px; border-radius: 3px; }
        </style>
    </head>
    <body>
        <h1>Glowmart API Server</h1>
        <p class="status">✅ Server is running!</p>
        <div class="endpoints">
            <h3>Available Endpoints:</h3>
            <ul>
                <li><code>/api/inventory/</code> - Products inventory</li>
                <li><code>/api/orders/</code> - Orders management</li>
                <li><code>/api/mpesa/</code> - M-PESA payments</li>
                <li><code>/api/user/</code> - User authentication</li>
                <li><code>/api/user/token/</code> - JWT Login</li>
                <li><code>/api/user/token/refresh/</code> - JWT Refresh</li>
                <li><code>/api/user/token/verify/</code> - JWT Verify</li>
                <li><code>/admin/</code> - Django admin panel</li>
            </ul>
        </div>
    </body>
    </html>
    """)

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    
    # JWT Authentication endpoints
    path('api/user/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # App URLs
    path('api/inventory/', include('inventory.urls')),  
    path('api/orders/', include('orders.urls')),  
    path('api/notifications/', include('notifications.urls')), 
    path('api/mpesa/', include('mpesa.urls')),
    path('api/user/', include('users.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)