```js
formatGains(gains) {
    let gainsText = [];
    
    // Format currency maximums
    if (gains.currencyMaximum) {
        for (const [currencyId, value] of Object.entries(gains.currencyMaximum)) {
            if (this.gameState.currencies[currencyId]) {
                gainsText.push(`+${value} ${this.gameState.currencies[currencyId].name} Maximum`);
            }
        }
    }
    
    // Format stat pool maximums
    if (gains.statPoolMaximum) {
        for (const [statPoolId, value] of Object.entries(gains.statPoolMaximum)) {
            if (this.gameState.statPools[statPoolId]) {
                gainsText.push(`+${value} ${this.gameState.statPools[statPoolId].name} Maximum`);
            }
        }
    }
    
    // Format currency generation
    if (gains.currencyGeneration) {
        for (const [currencyId, value] of Object.entries(gains.currencyGeneration)) {
            if (this.gameState.currencies[currencyId]) {
                gainsText.push(`+${value}/s ${this.gameState.currencies[currencyId].name} Generation`);
            }
        }
    }
    
    // Format special effects
    if (gains.specialEffects) {
        if (gains.specialEffects.doubleActions) {
            gainsText.push(`Perform multiple actions simultaneously`);
        }
        // Add other special effects formatting here
    }
    
    return gainsText.map(text => `<span class="gain">${text}</span>`).join(' ');
}
```