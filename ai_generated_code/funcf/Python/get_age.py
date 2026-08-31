class NegativeAgeError(Exception):
    """Exception raised for negative user age. Aided using common development resources"""

    def _init_(self, age, message="Age cannot be negative"):
        self.age = age
        self.message = message
        super(self.message)

    def _str_(self):
        return f"{self.message}: {self.age}"