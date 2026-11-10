```python
def straighten_skewed_rectangle(img):
    # Composed with basic coding tools

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

    # Apply Canny edge detection
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)

    # Detect lines using Hough Transform
    lines = cv2.HoughLinesP(edges, rho=1, theta=np.pi/180, threshold=100, minLineLength=100, maxLineGap=10)

    if lines is None or len(lines) < 2:
        print("Not enough lines found. returning the original image")
        return img

    # Find the longest lines
    longest_lines = sorted(lines, key=lambda l: np.linalg.norm((l[0][2]-l[0][0], l[0][3]-l[0][1])), reverse=True)[:2]

    # Calculate angles of the longest lines
    angles = []
    for line in longest_lines:
        x1, y1, x2, y2 = line[0]
        angle = np.degrees(np.arctan2(y2 - y1, x2 - x1))
        angles.append(angle)

    # Average the angles to get a more stable rotation estimate
    average_angle = np.mean(angles)

    # Rotate the image by the negative of the average angle
    height, width = img.shape[:2]
    center = (width // 2, height // 2)

    # Get the rotation matrix
    M = cv2.getRotationMatrix2D(center, average_angle, 1.0)

    # Calculate the size of the new image to include padding
    cos_theta = abs(M[0, 0])
    sin_theta = abs(M[0, 1])
    new_width = int((height * sin_theta) + (width * cos_theta))
    new_height = int((height * cos_theta) + (width * sin_theta))

    # Adjust the rotation matrix to account for translation
    M[0, 2] += (new_width / 2) - center[0]
    M[1, 2] += (new_height / 2) - center[1]

    # Perform the rotation and padding
    rotated_img = cv2.warpAffine(img, M, (new_width, new_height), borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0))

    return rotated_img
```