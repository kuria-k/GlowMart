# # mpesa/views.py
# import json
# import logging
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_http_methods
# from django.shortcuts import get_object_or_404
# from .models import MpesaTransaction
# from . import mpesa_config

# logger = logging.getLogger(__name__)

# @csrf_exempt
# @require_http_methods(["POST"])
# def initiate_payment(request):
#     """Initiate STK Push payment"""
#     try:
#         data = json.loads(request.body)
#         phone = data.get('phone')
#         amount = data.get('amount')
#         reference = data.get('reference', 'Payment')
#         description = data.get('description', 'M-Pesa Payment')
        
#         # Validate
#         if not phone or not amount:
#             return JsonResponse({
#                 'success': False,
#                 'error': 'Phone number and amount are required'
#             }, status=400)
        
#         # Validate amount
#         try:
#             amount = float(amount)
#             if amount <= 0:
#                 raise ValueError
#         except:
#             return JsonResponse({
#                 'success': False,
#                 'error': 'Amount must be a positive number'
#             }, status=400)
        
#         # Initiate STK Push
#         response = mpesa_config.stk_push(phone, amount, reference, description)
        
#         if response['success']:
#             # Save transaction
#             transaction = MpesaTransaction.objects.create(
#                 checkout_request_id=response['checkout_request_id'],
#                 merchant_request_id=response.get('merchant_request_id'),
#                 phone_number=phone,
#                 amount=amount,
#                 account_reference=reference,
#                 transaction_desc=description,
#                 status='pending'
#             )
            
#             return JsonResponse({
#                 'success': True,
#                 'checkout_request_id': response['checkout_request_id'],
#                 'merchant_request_id': response.get('merchant_request_id'),
#                 'message': 'Please check your phone to complete payment',
#                 'transaction_id': transaction.id
#             })
#         else:
#             return JsonResponse({
#                 'success': False,
#                 'error': response.get('error', 'Payment initiation failed'),
#                 'details': response.get('response', {})
#             }, status=400)
            
#     except json.JSONDecodeError:
#         return JsonResponse({
#             'success': False,
#             'error': 'Invalid JSON data'
#         }, status=400)
#     except Exception as e:
#         logger.error(f"Initiate payment error: {str(e)}")
#         return JsonResponse({
#             'success': False,
#             'error': str(e)
#         }, status=500)

# @csrf_exempt
# @require_http_methods(["POST"])
# def mpesa_callback(request):
#     """Handle M-Pesa callback"""
#     try:
#         callback_data = json.loads(request.body)
#         logger.info(f"Received M-Pesa callback: {json.dumps(callback_data, indent=2)}")
        
#         # Extract data
#         stk_callback = callback_data.get('Body', {}).get('stkCallback', {})
#         result_code = stk_callback.get('ResultCode')
#         result_desc = stk_callback.get('ResultDesc')
#         checkout_request_id = stk_callback.get('CheckoutRequestID')
#         merchant_request_id = stk_callback.get('MerchantRequestID')
#         callback_metadata = stk_callback.get('CallbackMetadata', {})
        
#         # Find transaction
#         try:
#             transaction = MpesaTransaction.objects.get(checkout_request_id=checkout_request_id)
            
#             # Update transaction
#             if merchant_request_id:
#                 transaction.merchant_request_id = merchant_request_id
            
#             transaction.result_code = result_code
#             transaction.result_desc = result_desc
#             transaction.callback_data = callback_data
            
#             if result_code == '0':
#                 # Successful transaction
#                 receipt_number = None
#                 amount = None
#                 balance = None
                
#                 for item in callback_metadata.get('Item', []):
#                     if item.get('Name') == 'MpesaReceiptNumber':
#                         receipt_number = item.get('Value')
#                     elif item.get('Name') == 'Amount':
#                         amount = item.get('Value')
#                     elif item.get('Name') == 'Balance':
#                         balance = item.get('Value')
                
#                 transaction.mark_completed(receipt_number, balance)
#                 logger.info(f"Transaction {checkout_request_id} completed successfully")
#             else:
#                 # Failed transaction
#                 transaction.mark_failed(result_code, result_desc)
#                 logger.warning(f"Transaction {checkout_request_id} failed: {result_desc}")
            
#             transaction.save()
            
#         except MpesaTransaction.DoesNotExist:
#             logger.warning(f"Transaction {checkout_request_id} not found in database")
#             # Create transaction record for missing transaction
#             transaction = MpesaTransaction.objects.create(
#                 checkout_request_id=checkout_request_id,
#                 merchant_request_id=merchant_request_id,
#                 result_code=result_code,
#                 result_desc=result_desc,
#                 callback_data=callback_data,
#                 status='failed' if result_code != '0' else 'completed',
#                 phone_number='unknown',
#                 amount=0,
#                 account_reference='unknown',
#                 transaction_desc='callback_received'
#             )
        
#         # Always return success to M-Pesa
#         return JsonResponse({'ResultCode': 0, 'ResultDesc': 'Success'})
        
#     except Exception as e:
#         logger.error(f"Error processing callback: {str(e)}")
#         return JsonResponse({'ResultCode': 1, 'ResultDesc': str(e)}, status=500)

# @require_http_methods(["GET"])
# def check_payment_status(request, checkout_id):
#     """Check payment status"""
#     try:
#         # Check in our database first
#         try:
#             transaction = MpesaTransaction.objects.get(checkout_request_id=checkout_id)
#             return JsonResponse({
#                 'success': True,
#                 'status': transaction.status,
#                 'receipt_number': transaction.mpesa_receipt_number,
#                 'amount': transaction.amount,
#                 'phone': transaction.phone_number,
#                 'reference': transaction.account_reference,
#                 'result_desc': transaction.result_desc,
#                 'created_at': transaction.created_at
#             })
#         except MpesaTransaction.DoesNotExist:
#             # Check with M-Pesa
#             response = mpesa_config.check_status(checkout_id)
#             if response['success']:
#                 data = response['data']
#                 result_code = data.get('ResultCode')
                
#                 return JsonResponse({
#                     'success': True,
#                     'status': 'completed' if result_code == '0' else 'failed',
#                     'mpesa_data': data
#                 })
#             else:
#                 return JsonResponse({
#                     'success': False,
#                     'error': 'Transaction not found'
#                 }, status=404)
#     except Exception as e:
#         logger.error(f"Check status error: {str(e)}")
#         return JsonResponse({'success': False, 'error': str(e)}, status=500)

# @require_http_methods(["GET"])
# def get_transactions(request):
#     """Get all transactions"""
#     transactions = MpesaTransaction.objects.all()
#     data = []
#     for t in transactions:
#         data.append({
#             'id': t.id,
#             'checkout_id': t.checkout_request_id,
#             'phone': t.phone_number,
#             'amount': str(t.amount),
#             'reference': t.account_reference,
#             'status': t.status,
#             'receipt': t.mpesa_receipt_number,
#             'date': t.created_at.strftime('%Y-%m-%d %H:%M:%S')
#         })
#     return JsonResponse({'success': True, 'transactions': data})


import json
import logging
import base64
import requests
from datetime import datetime
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings

from .models import MpesaTransaction

logger = logging.getLogger(__name__)


# ==============================
# ACCESS TOKEN
# ==============================
def get_access_token():
    try:
        auth_url = f"{settings.MPESA_API_URL}/oauth/v1/generate?grant_type=client_credentials"

        auth_string = f"{settings.MPESA_CONFIG['CONSUMER_KEY']}:{settings.MPESA_CONFIG['CONSUMER_SECRET']}"
        auth_base64 = base64.b64encode(auth_string.encode()).decode()

        response = requests.get(
            auth_url,
            headers={"Authorization": f"Basic {auth_base64}"},
            timeout=30
        )

        if response.status_code == 200:
            return response.json().get("access_token")

        logger.error(f"Token error: {response.text}")
        return None

    except Exception as e:
        logger.error(f"Token exception: {str(e)}")
        return None


# ==============================
# INITIATE PAYMENT
# ==============================
@csrf_exempt
@require_http_methods(["POST"])
def initiate_payment(request):
    try:
        data = json.loads(request.body)

        phone = data.get("phone")
        amount = data.get("amount")
        reference = data.get("reference", "Payment")

        if not phone or not amount:
            return JsonResponse({"success": False, "error": "Phone and amount required"}, status=400)

        # format phone
        phone = str(phone).strip()
        if phone.startswith("0"):
            phone = "254" + phone[1:]
        elif phone.startswith("+"):
            phone = phone[1:]

        token = get_access_token()
        if not token:
            return JsonResponse({"success": False, "error": "Auth failed"}, status=500)

        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

        password = base64.b64encode(
            f"{settings.MPESA_CONFIG['BUSINESS_SHORTCODE']}{settings.MPESA_CONFIG['PASSKEY']}{timestamp}".encode()
        ).decode()

        payload = {
            "BusinessShortCode": settings.MPESA_CONFIG["BUSINESS_SHORTCODE"],
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": str(amount),
            "PartyA": phone,
            "PartyB": settings.MPESA_CONFIG["BUSINESS_SHORTCODE"],
            "PhoneNumber": phone,
            "CallBackURL": settings.MPESA_CONFIG["CALLBACK_URL"],
            "AccountReference": reference[:50],
            "TransactionDesc": "Payment",
        }

        response = requests.post(
            f"{settings.MPESA_API_URL}/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers={"Authorization": f"Bearer {token}"}
        )

        result = response.json()

        if result.get("ResponseCode") == "0":
            MpesaTransaction.objects.create(
                checkout_request_id=result["CheckoutRequestID"],
                merchant_request_id=result.get("MerchantRequestID"),
                phone_number=phone,
                amount=amount,
                account_reference=reference,
                status="pending"
            )

            return JsonResponse({
                "success": True,
                "checkout_request_id": result["CheckoutRequestID"],
                "message": "STK push sent"
            })

        return JsonResponse({"success": False, "error": result}, status=400)

    except Exception as e:
        logger.error(str(e))
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def mpesa_callback(request):
    try:
        data = json.loads(request.body)

        stk = data.get("Body", {}).get("stkCallback", {})
        checkout_id = stk.get("CheckoutRequestID")

        transaction = MpesaTransaction.objects.filter(
            checkout_request_id=checkout_id
        ).first()

        if not transaction:
            return JsonResponse({"ResultCode": 0, "ResultDesc": "Accepted"})

        result_code = str(stk.get("ResultCode"))
        transaction.result_code = result_code
        transaction.result_desc = stk.get("ResultDesc")
        transaction.callback_data = data

        if result_code == "0":
            transaction.status = "completed"

            metadata = stk.get("CallbackMetadata", {}).get("Item", [])
            for item in metadata:
                if item.get("Name") == "MpesaReceiptNumber":
                    transaction.mpesa_receipt_number = item.get("Value")

        elif result_code == "1032":
            transaction.status = "cancelled"
        elif result_code == "1037":
            transaction.status = "timeout"
        else:
            transaction.status = "failed"

        transaction.save()

        # 🔥 SEND REAL-TIME UPDATE
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"mpesa_{checkout_id}",
            {
                "type": "send_payment_update",
                "data": {
                    "status": transaction.status,
                    "receipt": transaction.mpesa_receipt_number,
                },
            },
        )

        return JsonResponse({"ResultCode": 0, "ResultDesc": "Accepted"})

    except Exception as e:
        logger.error(str(e))
        return JsonResponse({"ResultCode": 1, "ResultDesc": "Error"})


# ==============================
# STATUS (LIGHT USE ONLY)
# ==============================
@require_http_methods(["GET"])
def check_payment_status(request, checkout_id):
    transaction = MpesaTransaction.objects.filter(
        checkout_request_id=checkout_id
    ).first()

    if not transaction:
        return JsonResponse({"status": "pending"})

    return JsonResponse({
        "status": transaction.status,
        "receipt": transaction.mpesa_receipt_number,
    })