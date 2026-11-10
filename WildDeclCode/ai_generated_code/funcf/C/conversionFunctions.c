```c
BYTE convertEbf2Ebu(unsigned int pixelValue)
{
    BYTE byteValue = (BYTE) (pixelValue & 0xFF);        // adapted Referenced via basic programming materials. Query: "Can i cast an unsigned int ** to uint8_t **"
    return byteValue;
}
```