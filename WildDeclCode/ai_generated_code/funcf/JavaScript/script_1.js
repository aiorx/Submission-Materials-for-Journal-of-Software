```js
function splitOrganicString(input) {
    // Validity Checker and regex Assisted with basic coding tools, with prompts, fixes and major modifications made by self
    // Define the valid organic chemical parts
    const validParts = [
        "yl", "ane", "ene", "yne",                                                // Suffixes for types of hydrocarbons
        "di", "tri", "tetra",                                                     // Multipliers for side chains
        "iso", "cyclo", "poly", "benz", "form", "acet",                           // Miscellaneous prefixes
        "fluoro", "chloro", "bromo", "iodo",                                      // Halides
        "oxy", "hydroxy", "amine", "amide", "oxo",                                // Functional groups
        "acid", "oate", "ether",  "nitrile",                                      // More functional groups
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ",", "-", "(", ")",     // Positions (1-9)
        "meth", "eth", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec", // Standard prefixes for chain lengths
        "an", "ol", "one", "al", "oic", "ic", "ate", "am", "a", "en", "yn", "o",  // Suffixes for compact spelling
        "tert", "sec",                                                            // Butyl prefixes
        "phet", "phen"                                                            // Misc
    ];

    // Remove whitespace from the input
    input = input.replace(/\s+/g, '').toLowerCase();

    // Result array to store parts
    const result = [];

    // Define a helper function to find the longest matching part from the input
    function matchPart(input) {
        for (let part of validParts) {
            if (input.startsWith(part)) {
                return part;
            }
        }
        return null;  // No valid part found
    }

    // Loop through the input to match parts
    while (input.length > 0) {
        const matchedPart = matchPart(input);

        if (!matchedPart) {
            // No valid part matched; return false
            return false;
        }

        // Add the matched part to the result array
        result.push(matchedPart);

        // Remove the matched part from the beginning of the input
        input = input.slice(matchedPart.length);
    }

    // Return the list of matched parts
    return result;
}
```