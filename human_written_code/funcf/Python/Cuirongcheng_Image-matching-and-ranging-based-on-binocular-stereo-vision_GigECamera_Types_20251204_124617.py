```python
def MV_CC_ConvertPixelTypeToBayerMode(nPixelType):
    """
    根据像素格式转换为Bayer颜色模式
    :param nPixelType: 像素格式
    :return: Bayer颜色模式
    """
    if nPixelType == MV_PixelFormatEnums.PixelFormat_BayerRG8.value or nPixelType == MV_PixelFormatEnums.PixelFormat_BayerRG16.value:
        return MV_BAYER_MODE.BayerRG
    elif nPixelType == MV_PixelFormatEnums.PixelFormat_BayerBG8.value or nPixelType == MV_PixelFormatEnums.PixelFormat_BayerBG16.value:
        return MV_BAYER_MODE.BayerBG
    elif nPixelType == MV_PixelFormatEnums.PixelFormat_BayerGR8.value or nPixelType == MV_PixelFormatEnums.PixelFormat_BayerGR16.value:
        return MV_BAYER_MODE.BayerGR
    elif nPixelType == MV_PixelFormatEnums.PixelFormat_BayerGB8.value or nPixelType == MV_PixelFormatEnums.PixelFormat_BayerGB16.value:
        return MV_BAYER_MODE.BayerGB
    elif nPixelType == MV_PixelFormatEnums.PixelFormat_BayerGRW8.value:
        return MV_BAYER_MODE.BayerGRW
    else:
        return MV_BAYER_MODE.BayerInvalid
```