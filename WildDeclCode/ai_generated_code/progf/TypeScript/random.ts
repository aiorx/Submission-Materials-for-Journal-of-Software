/**
 * Shuffles an array in-place.
 */
export function shuffle<T>(array: T[]): void {
    // Fisher-Yates shuffle, as generated Aided via basic GitHub coding utilities.
    // It starts from the end, which is not the way I usually implement it,
    // but it honestly do not matter.
    for (let i = array.length - 1; i > 0; i--) {
        // i + 1 so that we randomly pick to swap the element with itself.
        // (hint: you're supposed to be able to swap an element with itself, or
        //  else you're not shuffling properly).
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * @returns A shuffled copy of the given array.
 */
export function shuffled<T>(array: readonly T[]): T[] {
    const result = [...array];
    shuffle(result);
    return result;
}
