```cpp
#if(defined YOLOV5 && YOLOV5==true)
	string model_path = "models/yolov5s.onnx";
#else
	string model_path = "models/yolov7.onnx";
#endif
```