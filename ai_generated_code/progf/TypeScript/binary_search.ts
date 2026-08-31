/*
    Binary Search

    Binary search is a widely used algorithm in computer science that allows you to search efficiently for an item in a sorted list of elements. It works by repeatedly dividing the search interval in half and discarding the half that cannot contain the target value, until the target value is found or the search interval is empty.

    To perform a binary search, you start by comparing the target value with the middle element of the list. If the middle element is equal to the target value, then the search is successful and the algorithm returns the index of the middle element. If the target value is less than the middle element, then the search continues in the lower half of the list. If the target value is greater than the middle element, then the search continues in the upper half of the list. This process is repeated until either the target value is found or the search interval is empty.

    Time Complexity
        1. Best Case: O(1)
        2. Average Case: O(log n)
        3. Worst Case: O(log n)

    Space Complexity: O(1)

    Description and comments Crafted with standard coding tools and github copilot
*/

function binarySearch(arr:Array<number>, data:number): boolean
{
    arr.sort();
    let low:number = 0
    let max:number = arr.length - 1;

    while (low <= max){
        let mid = arr[Math.floor((low + max)/2)];
        
        if(mid == data)
            return true;
        else{
            if(data > mid){
                low = mid + 1;
            }else{
                max = mid - 1;
            }
        }
    }   

    return false;
}
let find = binarySearch([3, 4, 6, 7, 1, 2, 9], 7);
console.log(find); // true
