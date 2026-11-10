```cpp
template <class CharT = char>
FORCEINLINE constexpr hash_t::value_type khash(const CharT* str, hash_t::value_type value = hash_t::offset) noexcept
{
	return (*str ? khash(str + 1, hash_t::single(value, *str)) : value);
}
```