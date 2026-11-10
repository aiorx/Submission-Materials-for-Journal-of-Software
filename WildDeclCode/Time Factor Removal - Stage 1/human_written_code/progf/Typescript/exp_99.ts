import {
  customAlphabet as __customAlphabet,
  customRandom as __customRandom,
  CustomRandomGenerator,
  nanoid as __nanoid,
} from "./mod.ts";

const nanoid = async function (size: number) { return __nanoid(size); };
const customAlphabet = async function (alphabet: string, size: number) { return __customAlphabet(alphabet, size); };
const customRandom = async function (
  random: CustomRandomGenerator,
  alphabet: string,
  size: number,
) { return __customRandom(random, alphabet, size); };
