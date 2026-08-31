# Dependencies: numpy, PIL
def visualize(file: str, out: str, plt: int = 4):
    import numpy as np
    import math
    from PIL import Image
    arr = bytearray(open(file, "rb").read())
    reall = len(arr)
    sq = math.ceil(reall ** 0.5)
    ft = math.ceil(sq / math.sqrt(plt))
    arr.extend(0 for _ in range((ft ** 2) * plt - reall))
    Image.fromarray(
    np.array(arr).reshape(
    (ft, ft, plt) if plt > 1 else (ft, ft)), ["L", "LA", "RGB", "RGBA"][plt - 1]
    ).save(out)


# The fallowing code is Aided via basic GitHub coding utilities.
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Visualize a file to an image")
    parser.add_argument("file", help="The file to visualize")
    parser.add_argument("out", help="The output image")
    parser.add_argument("plt", type=int, default=4, nargs="?", help="Size of the palette (1-4)")
    args = parser.parse_args()
    visualize(args.file, args.out, args.plt)
