# initially Assisted using common GitHub development utilities
class Vec2:
    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vec2(self.x + other.x, self.y + other.y)

    def __iadd__(self, other):
        self.x += other.x
        self.y += other.y
        return self

    def __sub__(self, other):
        return Vec2(self.x - other.x, self.y - other.y)

    def __isub__(self, other):
        self.x -= other.x
        self.y -= other.y
        return self

    def __mul__(self, other):
        return Vec2(self.x * other, self.y * other)

    def __imul__(self, other):
        self.x *= other
        self.y *= other
        return self

    def __truediv__(self, other):
        return Vec2(self.x / other, self.y / other)

    def __itruediv__(self, other):
        self.x /= other
        self.y /= other
        return self

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __ne__(self, other):
        return self.x != other.x or self.y != other.y

    def __str__(self):
        return f"({self.x}, {self.y})"

    def __repr__(self):
        return f"Vec2({self.x}, {self.y})"

    def __iter__(self):
        return iter((self.x, self.y))

    def __getitem__(self, index):
        return (self.x, self.y)[index]

    def __len__(self):
        return 2

    def __abs__(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5

    def normalized(self):
        return self / abs(self)

    def dot(self, other):
        return self.x * other.x + self.y * other.y

    def cross(self, other):
        return self.x * other.y - self.y * other.x

    def angle(self, other):
        return math.acos(self.dot(other) / (abs(self) * abs(other)))

    def rotate(self, angle):
        return Vec2(
            self.x * math.cos(angle) - self.y * math.sin(angle),
            self.x * math.sin(angle) + self.y * math.cos(angle),
        )

    def lerp(self, other, t):
        return self + (other - self) * t

    def reflect(self, normal):
        return self - normal * 2 * self.dot(normal)

    def project(self, other):
        return other * (self.dot(other) / other.dot(other))

    def project_onto_unit(self, other):
        return other * self.dot(other)

    def __neg__(self):
        return Vec2(-self.x, -self.y)

    def is_zero(self):
        return self.x == 0 and self.y == 0
