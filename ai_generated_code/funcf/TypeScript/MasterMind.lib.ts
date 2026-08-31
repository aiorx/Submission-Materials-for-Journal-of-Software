// const createGenerator: (seed: string) => RandomGenerator = (seed: string) => {
//   // method body was Aided via basic GitHub coding utilities, with my modifications on radix (36 vs 10) and removed const variable after parseInt
//   let current = parseInt(seed, 36)
//   return {
//     nextInt: () => {
//       current = (current * 16807) % 2147483647
//       return current
//     }
//   }
// }