# # users/urls.py
# from django.urls import path
# from .views import AdminLoginView, AdminLogoutView, UserInfoView, CheckAuthView

# urlpatterns = [
#     path('info', UserInfoView.as_view(), name='user-info'),
#     path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
#     path('admin/logout/', AdminLogoutView.as_view(), name='admin-logout'),
#     path('auth/check/', CheckAuthView.as_view(), name='auth-check'),
# ]

# users/urls.py
# users/urls.py
from django.urls import path
from .views import (
    AdminLoginView,
    AdminLogoutView,
    CheckAuthView,
    CustomTokenRefreshView,
    UserInfoView
)

urlpatterns = [
    # Authentication endpoints
    path('admin/login/', AdminLoginView.as_view(), name='admin_login'),
    path('admin/logout/', AdminLogoutView.as_view(), name='admin_logout'),
    path('check-auth/', CheckAuthView.as_view(), name='check_auth'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserInfoView.as_view(), name='user_info'),
]

