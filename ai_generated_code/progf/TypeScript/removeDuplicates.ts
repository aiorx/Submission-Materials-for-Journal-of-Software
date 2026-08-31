// Option 1
// export function removeDuplicates(nums: number[]): number {
//     const numsCountMap: Map<number, number> = new Map()

//     let nextMapEntryCount: number = 0
//     let numsIndex: number = 0

//     for (let i = 0; i < nums.length; i++) {
//         if (!numsCountMap.has(nums[i])) {
//             numsCountMap.set(nums[i], 1)

//             nums[numsIndex] = nums[i]
//             numsIndex++
//         } else if (numsCountMap.get(nums[i])! < 2) {
//             nextMapEntryCount = numsCountMap.get(nums[i])!
//             numsCountMap.set(nums[i], nextMapEntryCount + 1)

//             nums[numsIndex] = nums[i]
//             numsIndex++
//         }
//     }
//     console.log(nums)
//     console.log(numsIndex)

//     return numsIndex
// }

// Option 2
// export function removeDuplicates(nums: number[]): number {
//     const numsCountMap: Map<number, number> = new Map()

//     for (let i = 0; i < initialLength; i++) {
//        if(!numsCountMap.has(nums[i])) {
//         numsCountMap.set(nums[i], 1)
//        } else if(numsCountMap.get(nums[i]) === 2) {
//         nums.splice(i, 1) // splice has O(n) complexity, so this leads to O(n2) complexity in worst case - not ideal
//         i-- //since we remove one number and the for will increment, if we wouldnt do this we would skip one number
//        } else {
//         numsCountMap.set(nums[i], numsCountMap.get(nums[i])! + 1)
//        }
//     }

//     return nums.length
// }

// Both options solve the problem, and I don't understand if we shouldn't simply add another array, but we add a map which increases space in O(n), so this is the following Aided using common development resources
// Option 3 - 2 pointer array (Space O(1))

export function removeDuplicates(nums: number[]): number {
    if (nums.length <= 2) return nums.length // If length is 2 or less, return the original length

    let writeIndex = 2 // The index where the next valid element will be written. The first 2 positions are always accepted, even if the 2 are the same, so we start at index 2

    for (let i = 2; i < nums.length; i++) {
        // Compare the current element with the element two positions before
        if (nums[i] !== nums[writeIndex - 2]) {
            nums[writeIndex] = nums[i] // Copy the element to the next valid position
            writeIndex++
        }
    }

    return writeIndex // Return the length of the valid part of the array
}
