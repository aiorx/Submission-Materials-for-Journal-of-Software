```cpp
// Write a comparator that will return true if and only if the
// first CharacterBlock has a smaller physical address
bool compareCharacterBlocks(const CharacterBlock& a, const CharacterBlock& b) {
    return a.address < b.address;
}
```