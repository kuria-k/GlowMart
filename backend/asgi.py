# """
# ASGI config for backend project.

# It exposes the ASGI callable as a module-level variable named ``application``.

# For more information on this file, see
# https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
# """

# import os

# from django.core.asgi import get_asgi_application

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# application = get_asgi_application()


import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# IMPORTANT: Set settings module BEFORE getting application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # Note: 'backend.settings' not 'your_project'

# Get Django ASGI application first
django_asgi_app = get_asgi_application()

# Now import your routing (must come AFTER django.setup())
from mpesa.routing import websocket_urlpatterns  # Replace 'your_actual_app_name'

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})