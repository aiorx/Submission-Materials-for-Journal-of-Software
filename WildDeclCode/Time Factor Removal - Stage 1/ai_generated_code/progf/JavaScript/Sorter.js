// Aided using common development resources
module.exports = class Sorter {;
   
    // Sorts an array of strings alphabetically
    sortAlphabetically(arr, getField, ascending = true) {
        var sortedArr = arr.slice().sort(function (a, b) {
            a = getField(a);
            b = getField(b);

            if (a.toLowerCase() < b.toLowerCase()) {
                return -1;
            }
            if (a.toLowerCase() > b.toLowerCase()) {
                return 1;
            }
            return 0;
        });
    
        return ascending ? sortedArr : sortedArr.reverse();
    }

    // Sorts an array of objects with timestamps
    sortByTimestamp(arr, getField, ascending = true) {
        var sortedArr = arr.slice().sort(function (a, b) {
            a = getField(a);
            b = getField(b);
            
            var timestampA = new Date(a).getTime();
            var timestampB = new Date(b).getTime();
            return timestampA - timestampB;
        });
        return ascending ? sortedArr : sortedArr.reverse();
    }

    // Sorts an array of numbers
    sortByNumbers(arr, getField, ascending = true) {
        var sortedArr = arr.slice().sort(function (a, b) {
            a = getField(a);
            b = getField(b);
            a - b
        });
        return ascending ? sortedArr : sortedArr.reverse();
    }
}