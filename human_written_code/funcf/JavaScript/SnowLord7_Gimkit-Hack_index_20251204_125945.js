Exploit.prototype.closest_number = function (number = 0, array = []) {
    let arr = array.map(function (k) { return Math.abs(k - number) }),
        min = Math.min.apply(Math, arr);

    return array[arr.indexOf(min)];
};