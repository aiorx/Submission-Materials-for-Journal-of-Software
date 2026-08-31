```cpp
bool api_set::query(std::wstring& name) const
{
	// SEARCH FOR ANY ENTRIES OF OUR PROXY DLL
	const auto iter = std::find_if(this->schema.begin(), this->schema.end(), [&](const map_api_schema::value_type& val)
	{
		return std::search(name.begin(), name.end(), val.first.begin(), val.first.end()) != name.end();
	});

	if (iter != this->schema.end() && !iter->second.empty()) // FOUND
	{
		name = (iter->second.front() != name ? iter->second.front() : iter->second.back());
		return true;
	}

	return false;
}
```