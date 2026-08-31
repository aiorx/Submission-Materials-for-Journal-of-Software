```cpp
void save()
{
	char buf[32];
	sprintf(buf, "data/CamCalibParma%d.yml", camID);
	FileStorage fs(buf, FileStorage::WRITE);
	if (fs.isOpened())
	{
		write(fs, "camType", (FISH_EYE? "eyeCam":"normalCam"));
		write(fs,"intrinsic_matrix",intrinsic_matrix);
		write(fs, "distortion_coeffs", distortion_coeffs);
		fs.release();
		cout << "\n param save complete! \n\n";
	}
}
```