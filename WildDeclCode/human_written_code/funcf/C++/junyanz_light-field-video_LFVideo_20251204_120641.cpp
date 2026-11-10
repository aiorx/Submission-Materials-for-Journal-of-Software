```cpp
void CLFVideo::WriteVideo(ImageSet _frames, string _videoPath, float fps) {
    VideoWriter oV;
    Size s = _frames[0].size();
    oV.open(_videoPath, CV_FOURCC('M','J','P','G'), fps, s, true);
    if (!oV.isOpened())
        DEBUG_ERROR("cannot create video %s", _videoPath.c_str());
    FOR_u (i, _frames.size()) {
        oV << _frames[i];
    }
}
```