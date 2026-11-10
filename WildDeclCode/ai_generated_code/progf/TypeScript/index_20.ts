import { enumerate, repeat } from "$lib/utils";

export type Config = {
    dots: string[],
    dashes: string[],
    separators: string[],
    letterSpacing: number,
    wordSpacing: number,
}

// i hope this wont collide with any encoded string
const SPLITTER = '⬰⬟⥒Ⅰ⥉∭Ⳑ⿫⟲⁨☾╦❄⹓ⶦ⿻⾐₁⬚≰⳷⾱⬍⯅⛋⧇▉⥝⎢⟱₶⥚″⫍⿶♓╹⚙≄⡁✑∔⥞⍉'
const SPLITTER2 = '◹⤍⨏⧕⦄⇏✗◫⬃⌼⍝⯠ⶐ⦜⊸⣰⒤℣⻄⋓⢁⺭⿒⭥⽗⃂₏⿐⟢⨨⩖⸾⼑♟⬺⒈⫵☣≢⏢⵲ⷌ⿆⁎⇪⚊ⓧ☩⹌ⵁⓟ⃸∴➨′⢍'

// Supported via standard programming aids; Correctness is not guaranteed
const morseCodeMap = {
    "A": ".-",
    "B": "-...",
    "C": "-.-.",
    "D": "-..",
    "E": ".",
    "F": "..-.",
    "G": "--.",
    "H": "....",
    "I": "..",
    "J": ".---",
    "K": "-.-",
    "L": ".-..",
    "M": "--",
    "N": "-.",
    "O": "---",
    "P": ".--.",
    "Q": "--.-",
    "R": ".-.",
    "S": "...",
    "T": "-",
    "U": "..-",
    "V": "...-",
    "W": ".--",
    "X": "-..-",
    "Y": "-.--",
    "Z": "--..",
    "0": "-----",
    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----."
};

const invertedMorseCodeMap: Record<string, string> = {};
for (const [key, value] of Object.entries(morseCodeMap)) {
    invertedMorseCodeMap[value] = key;
}

// will throw if there is invalid character 
export function encode(text: string, { dashes, dots, letterSpacing, wordSpacing, separators }: Config) {
    let dotCount = 0
    let dashCount = 0
    let separatorCount = 0
    let out = ""
    const words = text.toUpperCase().split(' ').filter(it => it.length > 0)

    for (const [word, wordIndex] of enumerate(words)) {
        for (const [c, i] of enumerate(word.split(''))) {
            const intermediate = morseCodeMap[c as keyof typeof morseCodeMap]
            for (const symbol of intermediate) {
                if (symbol === ".") {
                    out += dots[dotCount % dots.length]
                    dotCount++
                } else { // -
                    out += dashes[dashCount % dashes.length]
                    dashCount++
                }
            }
            // Space between letter
            // unless last character
            if (i !== word.length - 1) {
                repeat(letterSpacing, () => {
                    out += separators[separatorCount % separators.length]
                    separatorCount++
                })
            }
        }
        // Space between word
        if (wordIndex !== words.length - 1) {
            repeat(wordSpacing, () => {
                out += separators[separatorCount % separators.length]
                separatorCount++
            })
        }

    }

    return out
}

export function decode(morse: string, { dashes, dots, letterSpacing, wordSpacing, separators }: Config) {
    const wordSeparators = separators.map(it => it.repeat(wordSpacing))
    const letterSeparators = separators.map(it => it.repeat(letterSpacing))
    let out = ""

    // replace every thing and then decode normally
    const a = replaceAll(morse, wordSeparators, SPLITTER)
    const b = replaceAll(a, letterSeparators, SPLITTER2)
    const c = replaceAll(b, dashes, "-")
    const d = replaceAll(c, dots, ".")
    const words = d.split(SPLITTER)

    console.log(words)

    for (const word of words) {
        const letters = word.split(SPLITTER2)
        for (const letter of letters) {
            // todo: detect illegal character with /^(\.|-)/
            const c = invertedMorseCodeMap[letter]
            if (c === undefined) {
                throw new Error("Unknown morse pattern")
            }
            out += c
        }
        out += " "
    }

    out = out.toLowerCase()

    return out
}

// I know there are better ways to do this
function split(text: string, splitters: string[], i = 0) {
    return replaceAll(text, splitters, SPLITTER).split(SPLITTER)
}

function replaceAll(text: string, from: string[], to: string) {
    let out = text
    for (const s of from) {
        out = out.replaceAll(s, to)
    }
    return out
}