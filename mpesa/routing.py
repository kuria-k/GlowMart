from django.urls import re_path
from .customers import MpesaConsumer

websocket_urlpatterns = [
    # Allow any characters in checkout_id
    re_path(r"ws/mpesa/(?P<checkout_id>[^/]+)/$", MpesaConsumer.as_asgi()),
]