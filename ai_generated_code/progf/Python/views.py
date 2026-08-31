from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserProfileSerializer
from api.permissions import IsAdmin, IsCenterSupervisor, IsAssociationSupervisor, IsTrainer, IsStudent, IsAdminOrCenterSupervisor

User = get_user_model()

# Aided with basic GitHub coding tools
class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling user operations.
    
    Provides CRUD operations for users and additional endpoints for
    registration, profile management, password changing, and logout.
    
    list:
    Returns a paginated list of all users.
    
    retrieve:
    Returns the details of a specific user.
    
    create:
    Creates a new user account.
    
    update:
    Updates all fields of an existing user account.
    
    partial_update:
    Updates specific fields of an existing user account.
    
    destroy:
    Deletes a user account.
    
    Aided with basic GitHub coding tools
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Override to support filtering by role.
        
        Returns:
            QuerySet: Filtered queryset based on query parameters
        """
        queryset = User.objects.all()
        role = self.request.query_params.get('role', None)
        
        if role is not None:
            queryset = queryset.filter(role=role)
            
        return queryset
    
    def get_permissions(self):
        """
        Override to set custom permissions per action.
        
        Returns:
            list: List of permission classes based on the current action
        """
        if self.action == 'create' or self.action == 'register':
            return [IsAdminOrCenterSupervisor()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsAdminOrCenterSupervisor()]
        elif self.action in ['me', 'profile', 'change_password']:
            return [IsAuthenticated()]
        elif self.action == 'logout':
            return [IsAuthenticated()]
        return super().get_permissions()
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class based on action.
        
        Returns:
            Serializer: The serializer class to use
        """
        if self.action in ['me', 'profile']:
            return UserProfileSerializer
        return self.serializer_class
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """
        Custom action for user registration.
        
        Creates a new user account and returns authentication tokens.
        
        Example request:
        ```json
        {
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "password": "StrongPassword123!",
            "role": 1
        }
        ```
        
        Example response:
        ```json
        {
            "user": {
                "id": 1,
                "email": "user@example.com",
                "username": "",
                "first_name": "John",
                "last_name": "Doe",
                "role": 1,
                "date_joined": "2023-05-06T10:00:00Z",
                "is_active": true
            },
            "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
        ```
        
        Args:
            request: HTTP request object
            
        Returns:
            Response: User data with authentication tokens
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """
        Get or update the current authenticated user's profile.
        
        GET:
        Returns the current user's profile with all fields.
        
        PUT/PATCH:
        Updates the current user's profile.
        
        Example update request:
        ```json
        {
            "first_name": "Updated",
            "last_name": "Name",
            "phone_number": "0612345678",
            "address": "New Address"
        }
        ```
        
        Args:
            request: HTTP request object
            
        Returns:
            Response: User profile data
        """
        user = request.user
        
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        
        # Update user profile
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        """
        Invalidate the refresh token to log out.
        
        Blacklists the current refresh token making it unusable for
        obtaining new access tokens.
        
        Example request:
        ```json
        {
            "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
        ```
        
        Args:
            request: HTTP request object
            
        Returns:
            Response: Success message or error
        """
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
            return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def profile(self, request):
        """
        Alias for 'me' action.
        
        Returns the current user's profile.
        
        Args:
            request: HTTP request object
            
        Returns:
            Response: User profile data
        """
        return self.me(request)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """
        Change password for authenticated user.
        
        Example request:
        ```json
        {
            "old_password": "CurrentPassword123!",
            "new_password": "NewPassword456!"
        }
        ```
        
        Args:
            request: HTTP request object
            
        Returns:
            Response: Success message or error details
        """
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not old_password or not new_password:
            return Response(
                {"detail": "Both old and new passwords are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not user.check_password(old_password):
            return Response(
                {"detail": "Old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(new_password)
        user.save()
        
        return Response({"detail": "Password successfully changed."}, status=status.HTTP_200_OK)
