```cpp
void xyzi2xyz(pcl::PointCloud<pcl::PointXYZI>::Ptr XYZI, pcl::PointCloud<pcl::PointXYZ>::Ptr XYZ) {
    (*XYZ).points.resize((*XYZI).size());
    for (size_t i = 0; i < (*XYZI).points.size(); i++) {
        (*XYZ).points[i].x = (*XYZI).points[i].x;
        (*XYZ).points[i].y = (*XYZI).points[i].y;
        (*XYZ).points[i].z = (*XYZI).points[i].z;
    }
}
```