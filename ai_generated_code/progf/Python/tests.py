from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import UserRole
from .serializers import UserSerializer, UserProfileSerializer
import json

User = get_user_model()

# Assisted using common GitHub development utilities
class UserModelTests(TestCase):
    """
    Tests for the custom User model.
    
    Assisted using common GitHub development utilities
    """
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'StrongPassword123!',
            'role': UserRole.STUDENT
        }
        
    def test_create_user(self):
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.email, self.user_data['email'])
        self.assertEqual(user.first_name, self.user_data['first_name'])
        self.assertEqual(user.last_name, self.user_data['last_name'])
        self.assertTrue(user.check_password(self.user_data['password']))
        self.assertEqual(user.role, UserRole.STUDENT)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        
    def test_create_superuser(self):
        admin = User.objects.create_superuser(
            email='admin@example.com',
            password='AdminPassword123!',
            first_name='Admin',
            last_name='User'
        )
        self.assertEqual(admin.email, 'admin@example.com')
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_active)


class UserSerializerTests(TestCase):
    """
    Tests for the User serializers.
    
    Assisted using common GitHub development utilities
    """
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'StrongPassword123!',
            'role': UserRole.STUDENT
        }
        self.user = User.objects.create_user(**self.user_data)
        self.serializer = UserSerializer(instance=self.user)
        
    def test_user_serializer_contains_expected_fields(self):
        data = self.serializer.data
        self.assertIn('id', data)
        self.assertIn('email', data)
        self.assertIn('first_name', data)
        self.assertIn('last_name', data)
        self.assertIn('role', data)
        self.assertNotIn('password', data)  # Password should be write-only
        
    def test_user_serializer_validates_email_uniqueness(self):
        # Try to create another user with the same email
        duplicate_user_data = self.user_data.copy()
        duplicate_user_data['username'] = 'another_user'  # Different username
        
        serializer = UserSerializer(data=duplicate_user_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)
        
    def test_profile_serializer_contains_additional_fields(self):
        serializer = UserProfileSerializer(instance=self.user)
        data = serializer.data
        
        # Check for profile fields
        self.assertIn('profile_picture', data)
        self.assertIn('birth_date', data)
        self.assertIn('birth_city', data)
        self.assertIn('CIN_id', data)
        self.assertIn('phone_number', data)
        self.assertIn('address', data)
        self.assertIn('city', data)
        
        # Check for role display
        self.assertIn('role_display', data)
        self.assertEqual(data['role_display'], 'Student')


class UserViewSetTests(APITestCase):
    """
    Tests for the User API endpoints.
    
    Assisted using common GitHub development utilities
    """
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('user-register')
        self.user_data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'StrongPassword123!',
            'role': UserRole.STUDENT
        }
        
        # Create a test user for authenticated endpoints
        self.user = User.objects.create_user(
            email='existing@example.com',
            password='ExistingPassword123!',
            first_name='Existing',
            last_name='User',
            role=UserRole.STUDENT
        )
        
    def test_user_registration(self):
        response = self.client.post(
            self.register_url, 
            data=json.dumps(self.user_data), 
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('access', response.data)
        
        # Verify user was created in the database
        self.assertTrue(
            User.objects.filter(email=self.user_data['email']).exists()
        )
        
    def test_login(self):
        token_url = reverse('token_obtain_pair')
        login_data = {
            'email': 'existing@example.com',
            'password': 'ExistingPassword123!'
        }
        
        response = self.client.post(
            token_url, 
            data=json.dumps(login_data), 
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        
    def test_me_endpoint_unauthorized(self):
        me_url = reverse('user-me')
        response = self.client.get(me_url)
        
        # Should be unauthorized without token
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_me_endpoint_authorized(self):
        me_url = reverse('user-me')
        
        # Authenticate the client
        self.client.force_authenticate(user=self.user)
        response = self.client.get(me_url)
        
        # Should return user profile
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)
        self.assertEqual(response.data['first_name'], self.user.first_name)
        
    def test_change_password(self):
        change_password_url = reverse('user-change-password')
        
        # Authenticate the client
        self.client.force_authenticate(user=self.user)
        
        # Test with correct old password
        password_data = {
            'old_password': 'ExistingPassword123!',
            'new_password': 'NewPassword456!'
        }
        
        response = self.client.post(
            change_password_url,
            data=json.dumps(password_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh user from database
        self.user.refresh_from_db()
        
        # Verify password was changed
        self.assertTrue(self.user.check_password('NewPassword456!'))
        
    def test_change_password_wrong_old_password(self):
        change_password_url = reverse('user-change-password')
        
        # Authenticate the client
        self.client.force_authenticate(user=self.user)
        
        # Test with incorrect old password
        wrong_password_data = {
            'old_password': 'WrongPassword123!',
            'new_password': 'NewPassword456!'
        }
        
        response = self.client.post(
            change_password_url,
            data=json.dumps(wrong_password_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Refresh user from database
        self.user.refresh_from_db()
        
        # Verify password was NOT changed
        self.assertFalse(self.user.check_password('NewPassword456!'))
        self.assertTrue(self.user.check_password('ExistingPassword123!'))
        
    def test_logout(self):
        # First get a token
        token_url = reverse('token_obtain_pair')
        login_data = {
            'email': 'existing@example.com',
            'password': 'ExistingPassword123!'
        }
        
        login_response = self.client.post(
            token_url, 
            data=json.dumps(login_data), 
            content_type='application/json'
        )
        
        refresh_token = login_response.data['refresh']
        
        # Now try to logout
        logout_url = reverse('user-logout')
        logout_data = {'refresh': refresh_token}
        
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            logout_url,
            data=json.dumps(logout_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
