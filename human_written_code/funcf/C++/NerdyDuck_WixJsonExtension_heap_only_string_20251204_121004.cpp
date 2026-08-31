```cpp
template <class CharT, class Allocator>
size_t heap_only_string_factory<CharT, Allocator>::aligned_size(size_t n)
{
    return sizeof(storage_type) + n;
}
```