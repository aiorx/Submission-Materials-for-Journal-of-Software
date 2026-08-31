```cpp
bool Tello::takeoff()
{
	string response = sendCommand("takeoff");
	if(!response.compare("ok"))
	{
		return true;
	}
	return false;
}
```