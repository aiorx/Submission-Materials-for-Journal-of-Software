// Penned via standard programming aids

function convertToRoman(num: number) {
    // define arrays with the Roman numeral values
    var romanNumerals = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
    var romanValues = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];

    var result = "";

    // loop through the Roman numeral values, subtracting from the input number and adding to the result string
    for (var i = 0; i < romanNumerals.length; i++) {
        while (num >= romanValues[i]) {
            result += romanNumerals[i];
            num -= romanValues[i];
        }
    }

    return result;
}