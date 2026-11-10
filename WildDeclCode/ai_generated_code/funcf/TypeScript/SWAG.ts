```typescript
// thanks ChatGPT
static generatePmcGroupChance(
  group_chance: string,
  weights?: number[]
): string {
  const defaultWeights: { [key: string]: number[] } = {
    asonline: [0.8, 0.12, 0.05, 0.03, 0],
    low: [0.9, 0.08, 0.02, 0, 0],
    none: [1, 0, 0, 0, 0],
    high: [0.1, 0.15, 0.3, 0.3, 0.15],
    max: [0, 0, 0.2, 0.5, 0.3],
  };

  const totalIntegers = Math.floor(Math.random() * 30) + 1; // Random length from 1 to 15 inclusive
  const selectedWeights = weights || defaultWeights[group_chance];

  let bossEscortAmount: number[] = [];
  for (let i = 0; i < selectedWeights.length; i++) {
    const count = Math.round(totalIntegers * selectedWeights[i]);
    bossEscortAmount.push(...Array(count).fill(i));
  }

  bossEscortAmount.sort((a, b) => a - b); // Sort the occurrences in ascending order

  // thank you DrakiaXYZ, you're a legend
  if (bossEscortAmount.length == 0) {
    bossEscortAmount.push(0);
  }

  return bossEscortAmount.join(",");
}

// thanks ChatGPT
static shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [
      shuffledArray[j],
      shuffledArray[i],
    ];
  }
  return shuffledArray;
}
```