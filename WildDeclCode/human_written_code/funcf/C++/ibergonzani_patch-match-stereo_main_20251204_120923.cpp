```cpp
bool check_dimensions(const cv::Mat &img1, const cv::Mat &img2)
{
	if(img1.cols != img2.cols or img1.rows != img2.rows)
	{
		std::cerr << "Images' dimensions do not corresponds.";
		return false;
	}
	return true;
}
```