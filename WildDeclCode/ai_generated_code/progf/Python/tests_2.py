############# This test file was Assisted with basic coding tools #################

from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User, Group
from django.contrib.auth import get_user_model

class AccountsTests(TestCase):

    def setUp(self):
        # Create the roles/groups
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        moderator_group, _ = Group.objects.get_or_create(name='Moderator')  # Added Moderator group
        user_group, _ = Group.objects.get_or_create(name='User')
        guest_group, _ = Group.objects.get_or_create(name='Guest')  # Added Guest group

        # Create an Admin user
        self.admin_user = User.objects.create_user(
            username='admin_user',
            password='AdminPassword123!'
        )
        self.admin_user.groups.add(admin_group)

        # Create a Moderator user
        self.moderator_user = User.objects.create_user(
            username='moderator_user',
            password='ModeratorPassword123!'
        )
        self.moderator_user.groups.add(moderator_group)

        # Create a regular User
        self.regular_user = User.objects.create_user(
            username='regular_user',
            password='UserPassword123!'
        )
        self.regular_user.groups.add(user_group)

        # Create a Guest user
        self.guest_user = User.objects.create_user(
            username='guest_user',
            password='GuestPassword123!'
        )
        self.guest_user.groups.add(guest_group)

    # Tests for Signup, Login, and Profile Views

    def test_001_signup_view_get(self):
        response = self.client.get(reverse('signup'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'accounts/signup.html')

    def test_002_signup_view_post_valid(self):
        response = self.client.post(reverse('signup'), {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password1': 'NewUserPassword123!',
            'password2': 'NewUserPassword123!',
        })
        self.assertRedirects(response, reverse('signup_success'))
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_003_signup_view_post_invalid(self):
        response = self.client.post(reverse('signup'), {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password1': 'short',
            'password2': 'short',
        })
        self.assertTemplateUsed(response, 'accounts/signup_failure.html')
        self.assertFalse(User.objects.filter(username='newuser').exists())

    def test_004_login_view_get(self):
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'accounts/login.html')

    def test_005_login_view_post_valid(self):
        response = self.client.post(reverse('login'), {
            'username': 'regular_user',
            'password': 'UserPassword123!',
        })
        self.assertRedirects(response, reverse('profile'))

    def test_006_login_view_post_invalid(self):
        response = self.client.post(reverse('login'), {
            'username': 'regular_user',
            'password': 'wrongpassword',
        })
        self.assertTemplateUsed(response, 'accounts/login.html')

    # Tests for Profile Views Based on Roles

    def test_007_profile_view_for_admin(self):
        self.client.login(username='admin_user', password='AdminPassword123!')
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.context['is_admin'])
        self.assertFalse(response.context['is_user'])
        self.assertTemplateUsed(response, 'accounts/profile.html')

    def test_008_profile_view_for_moderator(self):
        self.client.login(username='moderator_user', password='ModeratorPassword123!')
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.context.get('is_admin', False))
        self.assertFalse(response.context.get('is_user', False))
        self.assertTemplateUsed(response, 'accounts/profile.html')
        # self.assertContains(response, "Moderator Panel")  # Uncomment if specific content check needed

    def test_009_profile_view_for_user(self):
        self.client.login(username='regular_user', password='UserPassword123!')
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.context['is_admin'])
        self.assertTrue(response.context['is_user'])
        self.assertTemplateUsed(response, 'accounts/profile.html')

    def test_010_profile_view_for_guest(self):
        self.client.login(username='guest_user', password='GuestPassword123!')
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.context.get('is_admin', False))
        self.assertFalse(response.context.get('is_user', False))
        self.assertTemplateUsed(response, 'accounts/profile.html')
        # self.assertContains(response, "Guest Dashboard")  # Uncomment if specific content check needed

    def test_011_logout_view(self):
        self.client.login(username='regular_user', password='UserPassword123!')
        response = self.client.post(reverse('logout'))
        self.assertRedirects(response, reverse('logout_success'))
