/*
    Linear Search

    Linear search is a very simple search algorithm. In this type of search, a sequential search is made over all items one by one. Every item is checked and if a match is found then that particular item is returned, otherwise the search continues till the end of the data collection.

    Time Complexity
        1. Best Case: O(1)
        2. Average Case: O(n)
        3. Worst Case: O(n)

    Space Complexity: O(1)

    Description and comments Formed using common development resources and github copilot
*/

function linearSearch(arr:Array<number>, data:number): boolean
{
    for(let i=0;i<arr.length;i++){
        if(arr[i] == data){ 
            return true;
        }
    }

    return false;
}

let find = linearSearch([3, 4, 6, 7, 1, 2, 9], 7);
console.log(find); // true
