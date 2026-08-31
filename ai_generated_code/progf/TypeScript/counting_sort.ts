/*
    Counting Sort Algorithm

    Counting sort is a sorting algorithm that works by counting the number of occurrences of each element in the input array, and then using that information to determine the position of each element in the sorted output array.

    The basic idea of counting sort is to use an auxiliary array, called the count array, to store the number of occurrences of each element in the input array. The count array is initialized with all elements set to zero, and then each element in the input array is mapped to its corresponding index in the count array, and the count array is updated accordingly.

    Once the count array has been constructed, the sorted output array can be constructed by iterating over the count array and placing each element in the output array the number of times that it appears in the count array.

    Time Complexity:
        1. Best Case: O(n+k)
        2. Average Case: O(n+k)
        3. Worst Case: O(n+k)

    Space Complexity: O(n+k)

    Description and comments Formed using common development resources and github copilot
*/

function countingSort(data: Array<number>): Array<number>
{
    let max = 0, min = data[0];
    let counter:Array<number> = [];
    let result:Array<number> = [];

    // Find the maximum and minimum values in the array
    for(let i=0;i<data.length;i++){
        if(data[i] > max){
            max = data[i];
        }
        if(data[i] < min){
            min = data[i];
        }
    }

    for(let i=0;i<max+1;i++){
        counter[i] = 0; // Initialize the counter array with 0
    }

    for(let i=0;i<data.length;i++){
        counter[data[i]] += 1; // Count the number of occurrences of each element
    }
    
    for(let i=1;i<counter.length-1;i++){
        counter[i+1] = counter[i] + counter[i+1]; // Calculate the number of elements less than or equal to the current element
    }

    for(let i=0;i<data.length;i++){
        result[counter[data[i]]] = data[i]; // Place the element at the index calculated in the previous step
        counter[data[i]] -= 1; // Decrement the counter
    }

    return result;
}

let data:Array<number> = [5, 2, 8, 9, 7, 4, 3, 6, 10, 1];
let result:Array<number> = countingSort(data);

console.log(result); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]