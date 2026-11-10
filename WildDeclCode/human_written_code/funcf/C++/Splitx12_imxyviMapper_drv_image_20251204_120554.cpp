```cpp
size_t drv_image::size() const
{
	return m_nt_headers->OptionalHeader.SizeOfImage;
}
```