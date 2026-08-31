/*
    Selection Sort
    
    Selection sort is a simple sorting algorithm used to sort a list or array of elements. The algorithm works by finding the smallest element in the unsorted portion of the list and moving it to the beginning of the list, then repeating the process for the remaining unsorted elements until the entire list is sorted.

    For example, let's take an array [64, 25, 12, 22, 11]. The selection sort algorithm would start by finding the smallest element (which is 11) and swapping it with the first element (64), resulting in [11, 25, 12, 22, 64]. Then, it would find the smallest element in the remaining unsorted portion of the list (which is 12) and swap it with the second element (25), resulting in [11, 12, 25, 22, 64]. This process would continue until the entire array is sorted in ascending order.

    Time Complexity
        1. Best: O(n^2)
        2. Average: O(n^2)
        3. Worst: O(n^2)
        
    Space Complexity: O(1)

    Description and comments Designed via basic programming aids and github copilot
*/

function selectionSort(data:Array<number>) : Array<number>
{
    let smallest:number, temp:number;
    for(let step = 0; step < data.length; step++){
        smallest = data[step]; // smallest variable is used to store the smallest value in the array
        temp = step; // temp variable is used to store the index of the smallest value in the array
        for(let i = step; i < data.length; i++){ // loop through the array to find the smallest value
            if(smallest > data[i]){
                temp = i; // store the index of the smallest value
                smallest = data[i]; 
            }             
        }
        data[temp] = data[step]; // swap the smallest value with the first value in the unsorted portion of the array
        data[step] = smallest; // swap the first value in the unsorted portion of the array with the smallest value
    }

    return data
}


let data:Array<number> = [5, 2, 8, 9, 7, 4, 3, 6, 10, 1];
let result:Array<number> = selectionSort(data);

console.log(result); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]