"""
M-Pesa Daraja API utility functions (safe version)
"""

import requests
import base64
import time
import json
import logging
from datetime import datetime
from django.conf import settings

logger = logging.getLogger(__name__)


def get_access_token(retry_attempts=None):
    """
    Generate OAuth access token from M-Pesa Daraja API.

    Returns:
        str | dict: access token if successful, or dict with error info
    """
    # Validate required settings
    required_settings = [
        "MPESA_CONSUMER_KEY",
        "MPESA_CONSUMER_SECRET",
        "MPESA_OAUTH_URL"
    ]
    missing = [s for s in required_settings if not hasattr(settings, s)]
    if missing:
        error_msg = f"Missing M-Pesa settings: {', '.join(missing)}"
        logger.error(error_msg)
        return {"success": False, "error": error_msg}

    consumer_key = settings.MPESA_CONSUMER_KEY
    consumer_secret = settings.MPESA_CONSUMER_SECRET
    oauth_url = settings.MPESA_OAUTH_URL

    if retry_attempts is None:
        retry_attempts = getattr(settings, "MPESA_RETRY_ATTEMPTS", 3)

    for attempt in range(retry_attempts):
        try:
            logger.info(f"Attempting to get access token (attempt {attempt + 1}/{retry_attempts})")
            response = requests.get(
                oauth_url,
                auth=(consumer_key, consumer_secret),
                timeout=getattr(settings, "MPESA_REQUEST_TIMEOUT", 30),
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            data = response.json()
            token = data.get("access_token")
            if token:
                logger.info("✓ Access token generated successfully")
                return token
            else:
                logger.warning(f"No access token in response: {data}")
        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed on attempt {attempt + 1}: {e}")
            if attempt < retry_attempts - 1:
                time.sleep(2)

    return {"success": False, "error": "Failed to obtain access token from M-Pesa"}


def generate_password(timestamp):
    """
    Base64 password for STK Push (ShortCode + PassKey + Timestamp)
    """
    try:
        return base64.b64encode(
            (settings.MPESA_SHORTCODE + settings.MPESA_PASSKEY + timestamp).encode()
        ).decode("utf-8")
    except Exception as e:
        logger.error(f"Password generation error: {e}")
        return None


def lipa_na_mpesa(phone_number, amount):
    """
    Initiates STK Push request safely, returns dict with success/error.
    """
    # Check required settings
    required_settings = [
        "MPESA_SHORTCODE",
        "MPESA_PASSKEY",
        "MPESA_STK_PUSH_URL",
        "MPESA_CALLBACK_URL"
    ]
    missing = [s for s in required_settings if not hasattr(settings, s)]
    if missing:
        error_msg = f"Missing M-Pesa settings: {', '.join(missing)}"
        logger.error(error_msg)
        return {"success": False, "error": error_msg}

    # Get access token
    access_token = get_access_token()
    if isinstance(access_token, dict) and not access_token.get("success", True):
        return access_token

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    password = generate_password(timestamp)
    if not password:
        return {"success": False, "error": "Failed to generate password"}

    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone_number,
        "PartyB": settings.MPESA_SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": settings.MPESA_CALLBACK_URL,
        "AccountReference": "TestPayment",
        "TransactionDesc": "Payment"
    }

    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}

    try:
        response = requests.post(settings.MPESA_STK_PUSH_URL, json=payload, headers=headers)
        response_data = response.json()
        if response_data.get("ResponseCode") == "0":
            return {"success": True, "data": response_data}
        return {"success": False, "error": response_data.get("ResponseDescription", "Unknown error")}
    except Exception as e:
        logger.error(f"STK Push error: {e}")
        return {"success": False, "error": str(e)}