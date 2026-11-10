import cv2
import numpy as np

# Code Supported via standard programming aids 4o
def conv2d(image, kernel, stride=1, padding=0):
    """
    Perform 2D convolution on an input image using the given kernel.

    Parameters:
    - image (numpy.ndarray): Input 2D array (grayscale image)
    - kernel (numpy.ndarray): 2D filter to apply
    - stride (int): Step size for moving the kernel
    - padding (int): Number of pixels to pad around the image

    Returns:
    - numpy.ndarray: The result of the convolution operation
    """

    # Get dimensions
    img_h, img_w = image.shape
    kernel_h, kernel_w = kernel.shape

    # Apply padding
    if padding > 0:
        image = np.pad(image, ((padding, padding), (padding, padding)), mode='constant', constant_values=0)

    # Compute output dimensions
    out_h = (image.shape[0] - kernel_h) // stride + 1
    out_w = (image.shape[1] - kernel_w) // stride + 1

    # Initialize output
    # Specify data type
    output = np.zeros((out_h, out_w), dtype=np.int32)

    # Perform convolution
    for i in range(out_h):
       for j in range(out_w):
            region = image[i * stride : i * stride + kernel_h, j * stride : j * stride + kernel_w]
            output[i, j] = np.sum(region * kernel)  # Integer convolution

    return output

def add_noise(img, n):
    img2 = img
    for _ in range(n):
        x = int(np.random.random() * img.shape[0])
        y = int(np.random.random() * img.shape[1])
        img2[x, y] = 156 # white in gray scale is 255
    return img2

if __name__ == '__main__':
    # Input original image file
    # To use another image input file, please change the filename
    # Also the downloaded 'standard_test_images/' should be in the same folder
    filename='mandril_color'
    img = cv2.imread(f'./{filename}.tif')
    # Write out original image in color bmp format
    # cv2.imwrite(f'./{filename}.bmp', img)
    # Convert to grayscale image
    image_gray = cv2.cvtColor(src=img, code=cv2.COLOR_BGR2GRAY)
    # Write out original image in grayscale bmp format (golden)
    cv2.imwrite(f'./golden/{filename}_gray.bmp', image_gray)

    # Add white noise points and write out another bmp file
    noise_img = add_noise(image_gray, 100)
    cv2.imwrite(f'./golden/{filename}_gray_noise.bmp', noise_img)

    # Gaussian blur Kernel 3x3
    Gkernel = np.array([[1, 2, 1], [2, 4, 2], [1, 2, 1]], dtype=np.int32)
    # Gkernel_scale= Gkernel/16

    # Convolve and Save Output
    image_gray_G2 = conv2d(image_gray, Gkernel, stride=1, padding=1)
    image_gray_G2_scale = (image_gray_G2 + 8) // 16
    cv2.imwrite(f'golden/{filename}_gray_noise_gaussian2.bmp', image_gray_G2_scale)

    

    # Laplacian Kernel 3x3
    Lkernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
    # Convolve and Save Output
    output = conv2d(image_gray_G2_scale, Lkernel, stride=1, padding=1)
    cv2.imwrite(f'golden/{filename}_gray_noise_gaussian_laplacian2.bmp', output)
