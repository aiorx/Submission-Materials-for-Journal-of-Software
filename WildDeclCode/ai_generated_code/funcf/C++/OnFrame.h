```cpp
// Thanks ChatGPT for generating this function
RE::NiPoint3 GetVelocity(std::size_t N, bool isLeft) const {
    if (N == 0 || N > capacity) {
        // Return zero velocity or handle error
        return RE::NiPoint3(0.0f, 0.0f, 0.0f);
    }

    std::size_t currentIdx = isLeft ? indexCurrentL : indexCurrentR;
    const std::vector<WeaponPos>& buffer = isLeft ? bufferL : bufferR;

    // Get the start and end positions
    RE::NiPoint3 startPosBottom = buffer[(currentIdx - N + capacity) % capacity].bottom;
    RE::NiPoint3 endPosBottom = buffer[(currentIdx - 1 + capacity) % capacity].bottom;
    RE::NiPoint3 startPosTop = buffer[(currentIdx - N + capacity) % capacity].top;
    RE::NiPoint3 endPosTop = buffer[(currentIdx - 1 + capacity) % capacity].top;

    // Calculate velocities
    RE::NiPoint3 velocityBottom = (endPosBottom - startPosBottom) / static_cast<float>(N);
    RE::NiPoint3 velocityTop = (endPosTop - startPosTop) / static_cast<float>(N);

    // Return the larger velocity based on magnitude
    return (velocityBottom.Length() > velocityTop.Length()) ? velocityBottom : velocityTop;
}
```