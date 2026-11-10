# Mostly Composed with basic coding tools

import os
from PIL import Image
from pathlib import Path

# === CONFIG ===
INPUT_DIR = "/home/koala/Photography"  # Change to your directory
OUTPUT_DIR = "assets/photos"   # Output directory (will be created if not exist)
MAX_SIZE_MB = 1
SUPPORTED_FORMATS = ('.jpg', '.JPG' ,'.jpeg', '.png', '.bmp', '.tiff', '.webp')  # Add more as needed

# Convert MB to Bytes
MAX_SIZE_BYTES = int(MAX_SIZE_MB * 1024 * 1024)

def compress_and_convert_to_jpg(input_path, output_path_stem, quality=85):
    try:
        img = Image.open(input_path)
        
        # Convert to RGB (required for JPEG)
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Create output path with .jpg extension
        output_path = output_path_stem.with_suffix(".jpg")
        
        # Try saving with decreasing quality
        for q in range(quality, 10, -5):
            img.save(output_path, format="JPEG", quality=q)
            if os.path.getsize(output_path) <= MAX_SIZE_BYTES:
                return output_path
        return None
    except Exception as e:
        print(f"Error processing {input_path}: {e}")
        return None

def find_images(directory):
    return [p for p in Path(directory).rglob("*") if p.suffix.lower() in SUPPORTED_FORMATS]

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    images = find_images(INPUT_DIR)
    print(f"Found {len(images)} image(s) in {INPUT_DIR}.")

    for img_path in images:
        output_path_stem = Path(OUTPUT_DIR) / img_path.stem
        original_size = os.path.getsize(img_path)

        if original_size <= MAX_SIZE_BYTES:
            print(f"{img_path.name} is already under {MAX_SIZE_MB}MB, converting to JPG.")
            try:
                img = Image.open(img_path)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                img.save(output_path_stem.with_suffix(".jpg"), format="JPEG", quality=85)
            except Exception as e:
                print(f"Error saving {img_path.name} as JPG: {e}")
        else:
            print(f"Compressing {img_path.name} ({original_size / 1024 / 1024:.2f} MB)...")
            result = compress_and_convert_to_jpg(img_path, output_path_stem)
            if result:
                new_size = os.path.getsize(result)
                print(f"Compressed to {new_size / 1024 / 1024:.2f} MB → {result.name}")
            else:
                print(f"Failed to compress {img_path.name} under {MAX_SIZE_MB}MB.")

if __name__ == "__main__":
    main()
