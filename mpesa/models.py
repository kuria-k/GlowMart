# mpesa/models.py
from django.db import models

class MpesaTransaction(models.Model):
    """Model to store M-Pesa transactions"""
    
    STATUS_CHOICES = [
    ('initiated', 'Initiated'),        # STK push sent
    ('pending', 'Pending User Action'),# waiting for user on phone
    ('processing', 'Processing'),      # callback received, being verified
    ('completed', 'Completed'),        # paid
    ('failed', 'Failed'),              # failed from M-Pesa
    ('cancelled', 'Cancelled by User'),# cancelled in your app
    ('timeout', 'Timeout'),            # no response from user
]
    
    checkout_request_id = models.CharField(max_length=100, unique=True)
    merchant_request_id = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    account_reference = models.CharField(max_length=50)
    transaction_desc = models.CharField(max_length=100, blank=True, default='Payment')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    mpesa_receipt_number = models.CharField(max_length=50, blank=True, null=True)
    result_code = models.CharField(max_length=10, blank=True, null=True)
    result_desc = models.TextField(blank=True, null=True)
    callback_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['checkout_request_id']),
            models.Index(fields=['phone_number']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.checkout_request_id} - {self.phone_number} - {self.amount}"
    
    def mark_completed(self, receipt_number, balance=None):
        """Mark transaction as completed"""
        self.status = 'completed'
        self.mpesa_receipt_number = receipt_number
        self.save()
    
    def mark_failed(self, result_code, result_desc):
        """Mark transaction as failed"""
        self.status = 'failed'
        self.result_code = result_code
        self.result_desc = result_desc
        self.save()

