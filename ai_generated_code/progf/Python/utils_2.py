# Copyright (c) 2025 Fernando "ferabreu" Mees Abreu
#
# Licensed under the MIT License. See LICENSE file in the project root for full license information.
#
"""
This code was written and annotated Assisted using common GitHub development aids at the request of Fernando "ferabreu" Mees Abreu (https://github.com/ferabreu).

Shared route utilities for the classifieds Flask app.

This module contains shared decorators and utility functions for use by multiple route Blueprints.
Currently, it provides the admin_required decorator for restricting access to admin users.
"""

import os
from functools import wraps

from flask import flash, redirect, url_for
from flask_login import current_user
from PIL import Image  # type: ignore


def admin_required(func):
    """
    Decorator to ensure the current user is an admin.

    - If the user is not authenticated or is not an admin,
      flashes an error message and redirects to the public listings index page.
    - Otherwise, allows access to the decorated view.

    Usage:
        @login_required
        @admin_required
        def admin_view():
            ...
    """

    @wraps(func)
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            flash("Admin access required.", "danger")
            return redirect(url_for("listings.index"))
        return func(*args, **kwargs)

    return wrapper


def create_thumbnail(image_path, thumbnail_path, size=(224, 224)):
    """
    Create a thumbnail from an image file.

    Args:
        image_path (str): Path to the original image
        thumbnail_path (str): Path where the thumbnail will be saved
        size (tuple): Thumbnail size (width, height)

    Returns:
        bool: True if thumbnail was created successfully, False otherwise
    """
    try:
        with Image.open(image_path) as img:
            # Convert palette images (P mode) with transparency to RGBA
            if img.mode == "P":
                img = img.convert("RGBA")
            # For all other images, convert to RGB if not already RGBA/RGB
            elif img.mode not in ("RGBA", "RGB"):
                img = img.convert("RGB")

            # Create thumbnail maintaining aspect ratio
            img.thumbnail(size, Image.Resampling.LANCZOS)

            # Create a new image with the exact size and paste the thumbnail centered
            thumbnail = Image.new("RGB", size, color="white")

            # Calculate position to center the thumbnail
            x = (size[0] - img.size[0]) // 2
            y = (size[1] - img.size[1]) // 2

            thumbnail.paste(img, (x, y))

            # Save the thumbnail
            thumbnail.save(thumbnail_path, "JPEG", quality=85)
            return True
    except Exception as e:
        print(f"Error creating thumbnail: {e}")
        return False


def serialize_category(cat):
    """
    Serializes a category object into a dictionary.
    Args:
        cat: An object representing a category, expected to have 'id' and 'name' attributes.
    Returns:
        dict: A dictionary containing the 'id' and 'name' of the category.
    """
    return {"id": cat.id, "name": cat.name}


def serialize_type(t):
    """
    Serializes a type object into a dictionary.
    Args:
        t: An object representing a type, expected to have 'id', 'name', and 'categories' attributes.
    Returns:
        dict: A dictionary containing the 'id', 'name', and 'categories' of the type.
    """
    return {
        "id": t.id,
        "name": t.name,
        "categories": [serialize_category(c) for c in t.categories],
    }
