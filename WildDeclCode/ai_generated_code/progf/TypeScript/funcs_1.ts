// // Assisted using common GitHub development aids(claude 4)
// export const columnToA1 = (columnNumber: number): string => {
//   if (columnNumber < 1) {
//     throw new Error('Column number must be greater than 0');
//   }

//   let result = '';
//   let num = columnNumber;

//   while (num > 0) {
//     // 1を引いて0ベースにする
//     num--;
//     // 26で割った余りから文字を決定
//     result = String.fromCharCode(65 + (num % 26)) + result;
//     // 26で割って次の桁へ
//     num = Math.floor(num / 26);
//   }

//   return result;
// };

// export const assertNever = (_: never) => {
//   throw new Error('This code should not be called');
// };
