# """
# M-Pesa Daraja API Configuration
# Place these in your Django settings.py or use python-dotenv to load from .env
# """

# import os
# from dotenv import load_dotenv

# load_dotenv()

# # ============================================================
# # M-PESA CONFIGURATION
# # ============================================================

# # Sandbox Credentials (from Daraja API portal)
# MPESA_CONSUMER_KEY = os.getenv(
#     "MPESA_CONSUMER_KEY",
#    "DiyO3HgTpc5PuM1xRNdBbXppU7YWE1vuYnlvGZMRBVwzwZcER"
# )
# MPESA_CONSUMER_SECRET = os.getenv(
#     "MPESA_CONSUMER_SECRET",
#     "23XZzrSz9gs4hg5eRsTXvp3oYHGF9OvRBIZQafef14SOFlpStiyfAA070pR4MrQG"
    
# )

# # Sandbox Details
# MPESA_SHORTCODE = os.getenv("MPESA_SHORTCODE", "174379")  # Sandbox shortcode
# MPESA_PASSKEY = os.getenv(
#     "MPESA_PASSKEY",
#     "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b107f78e6b72ada1ed2c919"
# )

# # API Endpoints
# MPESA_BASE_URL = os.getenv("MPESA_BASE_URL", "https://sandbox.safaricom.co.ke")
# MPESA_OAUTH_URL = f"{MPESA_BASE_URL}/oauth/v1/generate"
# MPESA_STK_PUSH_URL = f"{MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest"

# # Callback URL - FOR DEVELOPMENT, USE NGROK
# # During development, you have two options:
# # 
# # Option 1: Use ngrok (Recommended)
# # - Install: pip install ngrok
# # - Run in terminal: ngrok http 8000
# # - Copy the generated URL (e.g., https://abc123.ngrok.io)
# # - Set in .env: MPESA_CALLBACK_URL=https://abc123.ngrok.io/mpesa/callback/
# #
# # Option 2: Use a public test server (less recommended)
# # - Deploy to Heroku/Railway/Render temporarily
# # - Use that URL as callback
# #
# # NEVER use localhost for M-Pesa callbacks - it won't work
# MPESA_CALLBACK_URL = os.getenv(
#     "MPESA_CALLBACK_URL",
#     "https://webhook.site/your-unique-id"  # Placeholder - UPDATE THIS
# )

# # Validation Constants
# MPESA_MIN_AMOUNT = 1
# MPESA_MAX_AMOUNT = 150000
# MPESA_REQUEST_TIMEOUT = 30  # seconds
# MPESA_RETRY_ATTEMPTS = 3

"""
Django Settings: M-Pesa Daraja API Configuration
"""

# ============================================================
# M-PESA CONFIGURATION
# ============================================================

# Sandbox Credentials (from Daraja portal)
MPESA_CONSUMER_KEY = "DiyO3HgTpc5PuM1xRNdBbXppU7YWE1vuYnlvGZMRBVwzwZcER"
MPESA_CONSUMER_SECRET = "23XZzrSz9gs4hg5eRsTXvp3oYHGF9OvRBIZQafef14SOFlpStiyfAA070pR4MrQG"

# Sandbox Details
MPESA_SHORTCODE = "174379"
MPESA_PASSKEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b107f78e6b72ada1ed2c919"

# API Endpoints
MPESA_BASE_URL = "https://sandbox.safaricom.co.ke"
MPESA_OAUTH_URL = f"{MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials"
MPESA_STK_PUSH_URL = f"{MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest"

# Callback URL
# 🔹 Replace with your actual ngrok or public HTTPS endpoint
MPESA_CALLBACK_URL = "https://<your-ngrok-id>.ngrok.io/mpesa/callback/"

# Validation Constants
MPESA_MIN_AMOUNT = 1
MPESA_MAX_AMOUNT = 150000
MPESA_REQUEST_TIMEOUT = 30
MPESA_RETRY_ATTEMPTS = 3

# ============================================================
# Optional sanity check to catch missing settings
# ============================================================
required_settings = [
    "MPESA_CONSUMER_KEY",
    "MPESA_CONSUMER_SECRET",
    "MPESA_SHORTCODE",
    "MPESA_PASSKEY",
    "MPESA_STK_PUSH_URL",
    "MPESA_CALLBACK_URL",
]

for s in required_settings:
    if not globals().get(s):
        raise ValueError(f"Missing M-Pesa setting: {s}")