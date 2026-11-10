import unittest
from discord_stu.app import int_returner


# These tests auto Aided with basic GitHub coding tools
class TestIntReturner(unittest.TestCase):

    def test_default_value(self):
        self.assertEqual(int_returner(), 42)

    def test_custom_value(self):
        self.assertEqual(int_returner(10), 10)
        self.assertEqual(int_returner(100), 100)
        self.assertEqual(int_returner(-5), -5)


if __name__ == '__main__':
    unittest.main()
