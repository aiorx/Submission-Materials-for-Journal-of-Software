/*
    Insertion Sort
    
    Insertion sort is a simple sorting algorithm that works by taking one element at a time from an unsorted list and inserting it into its correct position in a sorted sublist. The algorithm starts by considering the first element of the list as the sorted sublist, then it takes the next element and inserts it into the correct position in the sorted sublist, and repeats this process until all elements have been inserted into the sorted sublist.

    For example, let's consider an unsorted list [5, 2, 4, 6, 1, 3]. The insertion sort algorithm would start by considering the first element, which is already in the sorted sublist. Then, it would take the second element (2) and compare it with the first element (5). Since 2 is smaller than 5, it would be inserted before 5, resulting in [2, 5, 4, 6, 1, 3]. Then, it would take the third element (4) and insert it into the correct position in the sorted sublist, resulting in [2, 4, 5, 6, 1, 3]. This process would continue until all elements have been inserted into the sorted sublist.

    Time Complexity
        1. Best Case: O(n^2)
        2. Average Case: O(n^2)
        3. Worst Case: O(n^2)

    Space Complexity: O(1)

    Description and comments Designed via basic programming aids and github copilot
*/

function insertionSort(data:Array<number>): Array<number>
{
    let step_index = 1;
    for(let i = 0; i < data.length; i++){
        // step_index 2
        for(let j = 0; j < step_index; j++){
            if(data[i] < data[j]){
                const temp = data[j];
                data[j] = data[i];
                data[i] = temp;
                step_index+=1;
            }
        }
    }
    return data
}


let data:Array<number> = [5, 2, 8, 9, 7, 4, 3, 6, 10, 1];
let result:Array<number> = insertionSort(data);

console.log(result); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]