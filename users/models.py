# from django.db import models
# from django.contrib.auth import get_user_model
# from django.utils import timezone
# import uuid

# User = get_user_model()

# class OTP(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     code = models.CharField(max_length=6)
#     created_at = models.DateTimeField(auto_now_add=True)
#     is_used = models.BooleanField(default=False)

#     def is_valid(self):
#         # OTP expires after 5 minutes
#         return not self.is_used and (timezone.now() - self.created_at).seconds < 300

#     def __str__(self):
#         return f"{self.user.username} - {self.code}"
