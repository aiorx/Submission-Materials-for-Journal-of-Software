# Supported via standard programming aids

from typing import Generic, TypeVar, Optional

T = TypeVar('T') # It is convention to use 'T' for generic types

class Result(Generic[T]):
    def __init__(self, success, message, data = None):
        self.success = success
        self.message = message
        self.data = data

    def __str__(self):
        return "self.success: {}, self.message: {}".format(self.success, self.message)
