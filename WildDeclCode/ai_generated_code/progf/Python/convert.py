import argparse
from PIL import Image
import struct

# fix broken screenshots
# https://unrealadmin.org/forums/showthread.php?p=155241

# Designed via basic programming aids

def read_invalid_bmp_and_convert_to_png(input_path, output_path):
    try:
        with open(input_path, 'rb') as f:
            # Read BMP header (14 bytes)
            bmp_header = f.read(14)
            signature, file_size, reserved1, reserved2, offset = struct.unpack('<2sIHHI', bmp_header)

            if signature != b'BM':
                raise ValueError("Not a valid BMP file (missing 'BM' signature)")

            # Read DIB header (40 bytes for BITMAPINFOHEADER)
            dib_header = f.read(40)
            (
                header_size, width, height, planes, bpp,
                compression, image_size, x_ppm, y_ppm, colors_used, important_colors
            ) = struct.unpack('<IiiHHIIIIII', dib_header)

            if compression != 0:
                raise ValueError("Compressed BMP files are not supported")

            print(f"Width: {width}, Height: {height}, Bits per Pixel: {bpp}")

            # Calculate raw row size (ignoring padding)
            raw_row_size = width * (bpp // 8)

            # Seek to pixel data offset
            f.seek(offset)

            # Read pixel data row by row
            pixel_data = []
            for _ in range(abs(height)):
                row_data = f.read(raw_row_size)
                if len(row_data) != raw_row_size:
                    raise ValueError("Unexpected end of file while reading pixel data")
                pixel_data.append(row_data)

            # Handle bottom-up BMP by reversing rows if height is positive
            if height > 0:
                pixel_data.reverse()

        # Convert to PNG using Pillow
        mode = {24: "RGB", 32: "RGBA"}.get(bpp)
        if not mode:
            raise ValueError(f"Unsupported bits per pixel: {bpp}")

        image = Image.frombytes(mode, (width, abs(height)), b''.join(pixel_data))
        image.save(output_path, "PNG")
        print(f"Converted image saved as: {output_path}")

    except Exception as e:
        print(f"Error processing BMP file: {e}")

def main():
    parser = argparse.ArgumentParser(description="Convert an invalid BMP file to PNG.")
    parser.add_argument("input_file", help="Path to the input BMP file")
    parser.add_argument("output_file", help="Path to save the output PNG file")
    args = parser.parse_args()

    read_invalid_bmp_and_convert_to_png(args.input_file, args.output_file)

if __name__ == "__main__":
    main()
