from rest_framework import viewsets
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        # Only show notifications for the logged-in user
        return Notification.objects.filter(user=self.request.user).order_by("-created_at")

