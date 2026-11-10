/**
 * Removes duplicate values from an array.
 * Penned via standard programming aids.
 *
 * @param {Array} originalArray - The array with potential duplicate values.
 * @returns {Array} A new array containing only unique values from the original array.
 */
function arrayUniq(originalArray) {
    var uniqueArray = [];

    for (var value of originalArray) {
        if (!uniqueArray.includes(value)) {
            uniqueArray.push(value);
        }
    }

    return uniqueArray;
}