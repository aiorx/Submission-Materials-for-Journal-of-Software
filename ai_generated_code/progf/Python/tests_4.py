from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from fibonacci.models import FibonacciNumber

# this entire class was Produced via common programming aids

class FibonacciViewTests(APITestCase):
    def test_generate_fibonacci_valid_input(self):
        """
        Ensure that a valid n_value returns the correct Fibonacci sequence and creates an entry in the database.
        """
        url = reverse('generate_fibonacci')
        data = {'n_value': 10}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('fibonacci_sequence', response.data)
        self.assertEqual(response.data['fibonacci_sequence'], '0,1,1,2,3,5,8,13,21,34')
        self.assertTrue(FibonacciNumber.objects.filter(n_value=10).exists())

    def test_generate_fibonacci_invalid_input(self):
        """
        Ensure that an invalid n_value returns a 400 Bad Request with the correct error message.
        """
        url = reverse('generate_fibonacci')
        data = {'n_value': 'invalid'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Invalid input: missing 'n_value' key in request data."})

    def test_generate_fibonacci_existing_entry(self):
        """
        Ensure that if an n_value already exists in the database, it is not recalculated, and the existing entry is returned.
        """
        # Create an entry in the database
        FibonacciNumber.objects.create(n_value=5, fibonacci_sequence='0,1,1,2,3')
        
        url = reverse('generate_fibonacci')
        data = {'n_value': 5}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['fibonacci_sequence'], '0,1,1,2,3')
        self.assertEqual(FibonacciNumber.objects.count(), 1)  # Ensure no new entry is created
