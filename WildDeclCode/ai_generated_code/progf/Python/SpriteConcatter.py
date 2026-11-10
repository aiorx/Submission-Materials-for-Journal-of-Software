####################################
# Code is fully Composed with basic coding tools.#
####################################

from PIL import Image

def split_image(image, tile_size):
    width, height = image.size
    tiles = []
    
    for y in range(0, height, tile_size):
        for x in range(0, width, tile_size):
            box = (x, y, x + tile_size, y + tile_size)
            tile = image.crop(box)
            tiles.append(tile)
    
    return tiles

def merge_tiles(tiles, tile_size):
    tile_count = len(tiles)
    width = tile_count * tile_size
    height = tile_size
    result_image = Image.new("RGBA", (width, height))  # Specify "RGBA" mode
    
    for i, tile in enumerate(tiles):
        result_image.paste(tile, (i * tile_size, 0))
    
    return result_image

def main():
    file_path = input("Enter the path to the image file: ")
    try:
        image = Image.open(file_path).convert("RGBA")  # Convert to RGBA mode
    except IOError:
        print("Failed to open the image file. Please check the path.")
        return
    
    tile_size = int(input("Enter the tile size: "))
    
    tiles = split_image(image, tile_size)
    result_image = merge_tiles(tiles, tile_size)
    
    result_image.save("merged_image.png")  # Save with the same filename
    print("Merged image saved as 'merged_image.png'")

if __name__ == "__main__":
    main()