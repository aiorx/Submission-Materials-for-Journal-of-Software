```javascript
#generateReadableTicks(timeRange, maxTicks)
{
    const [start, end] = timeRange
    const rangeLength = end - start

    if (rangeLength <= 0 || maxTicks <= 0)
        return []

    // Calculate an approximate step size based on the desired number of ticks
    let roughStep = Math.ceil(rangeLength / maxTicks)

    // Define base intervals
    const bases = [1, 2, 5, 10]

    // Find the power of 10 of the roughStep
    const power = Math.floor(Math.log10(roughStep))
    const baseStep = Math.pow(10, power)

    // Determine the closest larger interval using the base intervals
    let stepSize = bases.find(base => baseStep * base >= roughStep) * baseStep

    // Ensure stepSize is at least 1
    stepSize = Math.max(stepSize, 1)

    // Generate ticks
    const ticks = []
    let currentTick = Math.floor(start / stepSize) * stepSize  // Start at the nearest step size multiple

    while (currentTick <= end)
    {
        if (currentTick >= start)
            ticks.push(currentTick)

        currentTick += stepSize
    }

    // If only one tick fits, ensure it returns that single tick
    if (ticks.length === 0)
        ticks.push(start)
    else if (ticks.length > maxTicks)
        // Adjust ticks to ensure maxTicks limit
        ticks.length = maxTicks

    return ticks
}
```