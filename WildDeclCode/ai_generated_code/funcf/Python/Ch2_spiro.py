```python
def calculate_tangent_vector(self, a):
    # Calculate the derivative of x and y with respect to a
    dx_da = -self.R * ((1 - self.k) * math.sin(a) + (1 - self.k) * self.l * math.sin((1 - self.k) * a / self.k))
    dy_da = self.R * ((1 - self.k) * math.cos(a) - (1 - self.k) * self.l * math.cos((1 - self.k) * a / self.k))

    # Normalize the tangent vector
    magnitude = math.sqrt(dx_da**2 + dy_da**2)
    tangent_vector = (dx_da / magnitude, dy_da / magnitude)

    return tangent_vector
```