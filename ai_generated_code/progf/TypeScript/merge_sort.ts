/*
    Merge Sort

    Merge sort is a sorting algorithm that works by dividing the input array into two halves, sorting each half recursively, and then merging the two halves back together.

    For example, if we have the array [5, 2, 8, 9, 7, 4, 3, 6, 10, 1], we can divide it into two halves: [5, 2, 8, 9, 7] and [4, 3, 6, 10, 1]. We can then divide each of these halves into two more halves, and so on. Eventually, we will have 10 arrays that each contain one element. We can then merge these arrays back together in sorted order, resulting in the sorted array [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].

    Time Complexity:
        1. Best Case: O(n log n)
        2. Average Case: O(n log n)
        3. Worst Case: O(n log n)

    Space Complexity: O(n)

    Description and comments Formed using common development resources and github copilot
 */
function mergeSort(numbers: Array<number>): Array<number>
{
    if(numbers.length < 2)
        return numbers;
    else if(numbers.length === 2)
        return numbers[0] > numbers[1] ? [numbers[1], numbers[0]] : numbers;

    // Divide the array into halves
    let middle: number = Math.floor(numbers.length / 2);
    let left: Array<number> = numbers.slice(0, middle);
    let right: Array<number> = numbers.slice(middle);

    // Sort each half
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left: Array<number>, right: Array<number>): Array<number>
{
    let result: Array<number> = [];

    // Compare the arrays element by element and return the concatenated result
    while(left.length && right.length)
    {
        // If the first element of the left array is less than or equal to the first element of the right array,
        // push the first element of the left array into the result array
        if(left[0] <= right[0])
            result.push(left.shift());
        else
            result.push(right.shift());
    }

    // If the left array still has elements, push them into the result array
    while(left.length)
        result.push(left.shift());

    // If the right array still has elements, push them into the result array
    while(right.length)
        result.push(right.shift());

    return result;
}

console.log(mergeSort([5, 2, 8, 9, 7, 4, 3, 6, 10, 1])); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]