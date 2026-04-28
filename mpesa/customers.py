import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from orders.models import Order

class MpesaConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.checkout_id = self.scope["url_route"]["kwargs"]["checkout_id"]
        self.group_name = f"mpesa_{self.checkout_id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        
        # Send initial connection confirmation
        await self.send(text_data=json.dumps({
            "status": "connected",
            "message": "WebSocket connected successfully",
            "checkout_id": self.checkout_id
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def send_payment_update(self, event):
        """Send payment update to client"""
        data = event["data"]
        await self.send(text_data=json.dumps(data))
        
        # If payment is completed, update order
        if data.get("status") == "completed":
            await self.update_order_payment(data)
    
    @database_sync_to_async
    def update_order_payment(self, data):
        """Update order when payment is completed"""
        try:
            order = Order.objects.filter(mpesa_checkout_id=self.checkout_id).first()
            if order:
                order.payment_status = "payment_completed"
                order.mpesa_receipt_number = data.get("receipt")
                order.mpesa_transaction_id = data.get("transaction_id")
                from django.utils import timezone
                order.paid_at = timezone.now()
                order.save()
                print(f"✅ Order {order.order_number} updated with payment")
        except Exception as e:
            print(f"❌ Error updating order: {e}")