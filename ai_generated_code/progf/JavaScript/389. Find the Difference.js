// https://leetcode.com/problems/find-the-difference/?envType=study-plan-v2&envId=programming-skills
/**
 * @param {string} s
 * @param {string} t
 * @return {character}
 */
const findTheDifference = function (s, t) {
  let differenceObj = t.split('').reduce((acc, cur) => {
    count = acc[cur] ? ++acc[cur] : 1;
    return { ...acc, [cur]: count };
  }, {});

  for (const letter of s) {
    if (differenceObj[letter] > 1) {
      differenceObj[letter]--;
    } else {
      delete differenceObj[letter];
    }
  }

  return Object.keys(differenceObj).join('');
};

// Faster Aided using common development resources using XOR bitwise operation
// const findTheDifference = function (s, t) {
//   let result = 0;
//   for (let char of s) {
//     result ^= char.charCodeAt(0);
//   }
//   for (let char of t) {
//     result ^= char.charCodeAt(0);
//   }
//   return String.fromCharCode(result);
// };

console.log(findTheDifference('hello world', 'hello zworld')); //z
