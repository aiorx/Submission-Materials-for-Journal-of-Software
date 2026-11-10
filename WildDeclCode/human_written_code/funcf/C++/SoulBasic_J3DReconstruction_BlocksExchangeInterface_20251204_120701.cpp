```cpp
std::string getFileDir(const std::string& path)
{
	auto p = path.rfind('/');
	if (p == path.npos)
	{
		p = path.rfind('\\');
		if (p == path.npos)return "";
	}
	return path.substr(0, p);
}
```