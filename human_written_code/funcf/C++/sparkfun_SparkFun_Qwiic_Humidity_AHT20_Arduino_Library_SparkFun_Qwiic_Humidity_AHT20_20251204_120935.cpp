```cpp
bool AHT20::isConnected()
{
    _i2cPort->beginTransmission(_deviceAddress);
    if (_i2cPort->endTransmission() == 0)
        return true;

    //If IC failed to respond, give it 20ms more for Power On Startup
    //Datasheet pg 7
    delay(20);

    _i2cPort->beginTransmission(_deviceAddress);
    if (_i2cPort->endTransmission() == 0)
        return true;

    return false;
}
```