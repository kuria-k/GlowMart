# users/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView as JWTTokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
import logging

logger = logging.getLogger(__name__)


class AdminLoginView(APIView):
    """
    Admin login using JWT tokens stored in HttpOnly cookies
    """
    permission_classes = [AllowAny]
    
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    
    def post(self, request):
        try:
            # Get credentials
            username = request.data.get('username')
            password = request.data.get('password')
            
            # Validate input
            if not username or not password:
                return Response({
                    'success': False,
                    'error': 'Username and password are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Authenticate user
            user = authenticate(username=username, password=password)
            
            # Check if user exists and is superuser
            if user and user.is_superuser:
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                
                # Prepare response
                response_data = {
                    'success': True,
                    'username': user.username,
                    'is_superuser': True,
                    'user_id': user.id,
                    'message': 'Login successful'
                }
                
                response = Response(response_data, status=status.HTTP_200_OK)
                
                # Set HttpOnly cookies
                response.set_cookie(
                    'access_token',
                    str(refresh.access_token),
                    httponly=True,
                    secure=False,  # Set to True in production with HTTPS
                    samesite='Lax',
                    max_age=3600 * 24,  # 24 hours
                    path='/'
                )
                
                response.set_cookie(
                    'refresh_token',
                    str(refresh),
                    httponly=True,
                    secure=False,
                    samesite='Lax',
                    max_age=3600 * 24 * 7,  # 7 days
                    path='/'
                )
                
                logger.info(f"Admin user logged in: {user.username}")
                return response
            else:
                return Response({
                    'success': False,
                    'error': 'Invalid credentials or insufficient privileges'
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Login failed. Please try again.'
            }, status=status.HTTP_400_BAD_REQUEST)


class AdminLogoutView(APIView):
    """
    Logout by clearing authentication cookies
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Optional: Blacklist the refresh token
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                except Exception as e:
                    logger.warning(f"Could not blacklist token: {e}")
            
            response = Response({
                'success': True,
                'message': 'Logged out successfully'
            })
            
            # Delete cookies
            response.delete_cookie('access_token', path='/')
            response.delete_cookie('refresh_token', path='/')
            
            return response
            
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Logout failed'
            }, status=status.HTTP_400_BAD_REQUEST)


class CheckAuthView(APIView):
    """
    Check if user is authenticated via HttpOnly cookie
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({
            'is_authenticated': True,
            'user': {
                'username': request.user.username,
                'email': request.user.email,
                'is_superuser': request.user.is_superuser,
                'user_id': request.user.id,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name
            }
        })


class CustomTokenRefreshView(APIView):
    """
    Refresh access token using refresh token from HttpOnly cookie
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            # Get refresh token from cookie
            refresh_token = request.COOKIES.get('refresh_token')
            
            if not refresh_token:
                return Response({
                    'success': False,
                    'error': 'Refresh token not found'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create refresh token object
            refresh = RefreshToken(refresh_token)
            
            # Get new access token
            access_token = str(refresh.access_token)
            
            response = Response({
                'success': True,
                'message': 'Token refreshed successfully'
            })
            
            # Set new access token cookie
            response.set_cookie(
                'access_token',
                access_token,
                httponly=True,
                secure=False,  # Set to True in production with HTTPS
                samesite='Lax',
                max_age=3600 * 24,  # 24 hours
                path='/'
            )
            
            return response
            
        except (InvalidToken, TokenError) as e:
            logger.warning(f"Token refresh failed: {str(e)}")
            return Response({
                'success': False,
                'error': 'Invalid or expired refresh token'
            }, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.error(f"Token refresh error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Token refresh failed'
            }, status=status.HTTP_400_BAD_REQUEST)


class UserInfoView(APIView):
    """
    Get detailed user information
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'is_superuser': request.user.is_superuser,
            'is_staff': request.user.is_staff,
            'date_joined': request.user.date_joined,
            'last_login': request.user.last_login,
        })
    

