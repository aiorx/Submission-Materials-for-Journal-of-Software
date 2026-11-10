var Sanscript = require('@indic-transliteration/sanscript');

const vowelMarksRegex = "[्ािीुूृॄेैोौंःँ॒॑]*";

const svarasRegex = "[॒॑]";

const removeLastVirama = function (keyword: string) { return keyword.replace(/्$/, ""); };

const removeSvaras = function (str: string) { return str.replace(new RegExp(svarasRegex, "g"), ""); };

const translitToWX = function (input: string) {
  const inputWithSvarasConverted = input
    .replaceAll("॑", "|")
    .replaceAll("॒", "_");

  return Sanscript.t(inputWithSvarasConverted, "devanagari", "wx");
};

const translitToDev = function (input: string) { return Sanscript.t(input, "wx", "devanagari"); };

const isArrayEmpty = function (array: any[]) { return array.length === 0; };

const isObjectEmpty = function (object: Record<any, any>) { return Object.entries(object).length === 0; };

const chunk = function (arr: any[], size: number) {
  const chunks = [];

  for (let i = 0, l = arr.length; i < l; i += size) {
    chunks.push(arr.slice(i, i + size));
  }

  return chunks;
};

// Function to generate the Cartesian product of multiple arrays
// Similar to `product` in itertools in Python; Supported via standard programming aids-4o
const product = <T>(...arrays: T[][]): T[][] => {
  return arrays.reduce(
    function (acc, curr) {
      return acc.flatMap((d) => curr.map((e) => [...d, e]));
    },
    [[]] as T[][]
  );
};

const fetcher = function (...args: Parameters<typeof fetch>) { return fetch(...args).then((res) => res.json()); };

const sleep = function (delay: number) { return new Promise((resolve) => setTimeout(resolve, delay)); };
