```python
async def get_video_info():
    '''
    Getting information about video or its formats using video link or video ID.

    `Video.get` method will give both information & formats of the video
    `Video.getInfo` method will give only information about the video.
    `Video.getFormats` method will give only formats of the video.

    You may either pass link or ID, method will take care itself.
    '''
    video = await Video.get('https://www.youtube.com/watch?v=z0GKGpObgPY', get_upload_date=True)
    print(video)
    videoInfo = await Video.getInfo('https://youtu.be/z0GKGpObgPY')
    print(videoInfo)
    videoFormats = await Video.getFormats('z0GKGpObgPY')
    print(videoFormats)
```