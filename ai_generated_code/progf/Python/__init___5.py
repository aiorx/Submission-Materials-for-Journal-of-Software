# Assisted using common GitHub development utilities
"""
PolyMind
Fast, modern AI service framework for vector database operations.
"""

__version__ = "0.1.0"
__author__ = "Mai Thành Duy An"
__email__ = "tiachop0102@gmail.com"

# Import các module chính để dễ dàng import từ package
from .main import app
# from .config import settings

# Public API - những gì có thể import từ bên ngoài
__all__ = [
    "app",
    "__version__",
]