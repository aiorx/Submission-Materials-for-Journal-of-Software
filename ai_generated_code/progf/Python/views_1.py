from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer

# Assisted using common GitHub development utilities
class DecoratedTokenObtainPairView(TokenObtainPairView):
    """
    Takes a set of user credentials and returns an access and refresh JSON web
    token pair to prove the authentication of those credentials.
    
    Assisted using common GitHub development utilities
    """
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(
        operation_description="""
        ## Login endpoint
        
        Takes user credentials and returns JWT tokens for authentication.
        
        ### Request Format
        ```json
        {
            "email": "user@example.com",
            "password": "yourpassword"
        }
        ```
        
        ### Response Format
        ```json
        {
            "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
        ```
        
        The access token is used for API calls and is valid for 24 hours.
        The refresh token is used to get new access tokens and is valid for 7 days.
        """,
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['email', 'password'],
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_EMAIL),
                'password': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_PASSWORD),
            }
        ),
        responses={
            200: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'refresh': openapi.Schema(type=openapi.TYPE_STRING),
                    'access': openapi.Schema(type=openapi.TYPE_STRING),
                }
            ),
            401: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'detail': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example="No active account found with the given credentials"
                    )
                }
            )
        }
    )
    def post(self, request, *args, **kwargs):
        """
        Get JWT tokens by providing email and password.
        """
        return super().post(request, *args, **kwargs)


class DecoratedTokenRefreshView(TokenRefreshView):
    """
    Takes a refresh type JSON web token and returns an access type JSON web
    token if the refresh token is valid.
    
    Assisted using common GitHub development utilities
    """
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(
        operation_description="""
        ## Token refresh endpoint
        
        Use this endpoint to refresh your access token using a valid refresh token.
        
        ### Request Format
        ```json
        {
            "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
        ```
        
        ### Response Format
        ```json
        {
            "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
        ```
        
        Important: Keep your refresh tokens secure and never share them.
        """,
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['refresh'],
            properties={
                'refresh': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Valid refresh token'
                ),
            }
        ),
        responses={
            200: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'access': openapi.Schema(type=openapi.TYPE_STRING),
                }
            ),
            401: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'detail': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example="Token is invalid or expired"
                    ),
                    'code': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        example="token_not_valid"
                    )
                }
            )
        }
    )
    def post(self, request, *args, **kwargs):
        """
        Get a new access token using a valid refresh token.
        """
        return super().post(request, *args, **kwargs)
