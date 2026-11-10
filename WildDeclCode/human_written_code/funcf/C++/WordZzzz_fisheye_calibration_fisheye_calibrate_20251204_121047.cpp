```cpp
void drawChessboardCorners(const Mat& image, Size patternSize, const vector<Point2f>& corners, bool patternWasFound)
{
    if (!patternWasFound)
        return;

    int i, j;
    int n = patternSize.height;
    int m = patternSize.width;

    for (i = 0; i < n; i++)
    {
        for (j = 0; j < m; j++)
        {
            int idx = i * m + j;
            circle(image, corners[idx], 5, Scalar(0, 255, 0), 2, 8, 0);
        }
    }
}
```