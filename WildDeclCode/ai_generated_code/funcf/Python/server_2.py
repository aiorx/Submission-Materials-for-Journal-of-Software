```python
def compress_image_to_target_size(pil_img, target_size_mb=1, format="JPEG"):
    """
    Compress a PIL image to approximately the target size in MB.
    < Drafted using common development resources >

    Args:
        pil_img: PIL Image object
        target_size_mb: Target size in megabytes (default: 1)
        format: Image format ("JPEG" or "PNG")

    Returns:
        bytes: Compressed image data
    """
    target_size_bytes = target_size_mb * 1024 * 1024  # Convert MB to bytes

    # Convert to RGB if saving as JPEG (JPEG doesn't support transparency)
    if format.upper() == "JPEG" and pil_img.mode in ("RGBA", "P"):
        pil_img = pil_img.convert("RGB")

    # Start with high quality and reduce if needed
    quality = 95
    min_quality = 10

    while quality >= min_quality:
        img_byte_arr = io.BytesIO()

        if format.upper() == "JPEG":
            pil_img.save(img_byte_arr, format="JPEG", quality=quality, optimize=True)
        else:
            # For PNG, use optimization
            pil_img.save(img_byte_arr, format="PNG", optimize=True)

        img_size = img_byte_arr.tell()

        if img_size <= target_size_bytes:
            return img_byte_arr.getvalue()

        # Reduce quality for next iteration
        quality -= 5

    # If still too large, resize the image
    return resize_and_compress_image(pil_img, target_size_bytes, format)
```