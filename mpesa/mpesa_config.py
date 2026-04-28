# mpesa/mpesa_config.py
import base64
import requests
from datetime import datetime
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def get_access_token():
    """Get M-Pesa access token"""
    auth_url = f"{settings.MPESA_API_URL}/oauth/v1/generate?grant_type=client_credentials"
    auth_string = f"{settings.MPESA_CONFIG['CONSUMER_KEY']}:{settings.MPESA_CONFIG['CONSUMER_SECRET']}"
    auth_bytes = auth_string.encode('ascii')
    auth_base64 = base64.b64encode(auth_bytes).decode('ascii')
    
    try:
        response = requests.get(
            auth_url,
            headers={'Authorization': f'Basic {auth_base64}'},
            timeout=30
        )
        
        if response.status_code == 200:
            token_data = response.json()
            logger.info("Successfully got access token")
            return token_data['access_token']
        else:
            logger.error(f"Token failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        logger.error(f"Error getting token: {str(e)}")
        return None

def stk_push(phone_number, amount, account_reference, transaction_desc="Payment"):
    """Initiate STK Push"""
    
    logger.info(f"Initiating STK Push - Phone: {phone_number}, Amount: {amount}")
    
    # Format phone number
    phone = str(phone_number).strip()
    if phone.startswith('0'):
        phone = '254' + phone[1:]
    elif phone.startswith('+'):
        phone = phone[1:]
    elif not phone.startswith('254'):
        phone = '254' + phone
    
    logger.info(f"Formatted phone: {phone}")
    
    # Get token
    token = get_access_token()
    if not token:
        return {'success': False, 'error': 'Failed to get access token'}
    
    # Generate password
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password_str = f"{settings.MPESA_CONFIG['BUSINESS_SHORTCODE']}{settings.MPESA_CONFIG['PASSKEY']}{timestamp}"
    password = base64.b64encode(password_str.encode()).decode()
    
    # Prepare request
    payload = {
        'BusinessShortCode': settings.MPESA_CONFIG['BUSINESS_SHORTCODE'],
        'Password': password,
        'Timestamp': timestamp,
        'TransactionType': 'CustomerPayBillOnline',
        'Amount': str(amount),
        'PartyA': phone,
        'PartyB': settings.MPESA_CONFIG['BUSINESS_SHORTCODE'],
        'PhoneNumber': phone,
        'CallBackURL': settings.MPESA_CONFIG['CALLBACK_URL'],
        'AccountReference': account_reference[:50],
        'TransactionDesc': transaction_desc[:50]
    }
    
    # Make request to M-Pesa
    url = f"{settings.MPESA_API_URL}/mpesa/stkpush/v1/processrequest"
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        logger.info(f"Sending request to M-Pesa")
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        logger.info(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('ResponseCode') == '0':
                logger.info(f"STK Push successful: {data.get('CheckoutRequestID')}")
                return {
                    'success': True,
                    'checkout_request_id': data['CheckoutRequestID'],
                    'merchant_request_id': data.get('MerchantRequestID'),
                    'response': data
                }
            else:
                logger.error(f"STK Push failed: {data}")
                return {
                    'success': False,
                    'error': data.get('ResponseDescription', 'Unknown error'),
                    'response': data
                }
        else:
            logger.error(f"HTTP Error: {response.status_code} - {response.text}")
            return {
                'success': False,
                'error': f'HTTP {response.status_code}',
                'response': {'status_code': response.status_code, 'text': response.text}
            }
            
    except Exception as e:
        logger.error(f"STK Push error: {str(e)}")
        return {'success': False, 'error': str(e)}

def check_status(checkout_request_id):
    """Check transaction status"""
    token = get_access_token()
    if not token:
        return {'success': False, 'error': 'Failed to get access token'}
    
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password_str = f"{settings.MPESA_CONFIG['BUSINESS_SHORTCODE']}{settings.MPESA_CONFIG['PASSKEY']}{timestamp}"
    password = base64.b64encode(password_str.encode()).decode()
    
    payload = {
        'BusinessShortCode': settings.MPESA_CONFIG['BUSINESS_SHORTCODE'],
        'Password': password,
        'Timestamp': timestamp,
        'CheckoutRequestID': checkout_request_id
    }
    
    url = f"{settings.MPESA_API_URL}/mpesa/stkpushquery/v1/query"
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        return {'success': True, 'data': response.json()}
    except Exception as e:
        return {'success': False, 'error': str(e)}