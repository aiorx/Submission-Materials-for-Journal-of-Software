
/**
 * Checks if input is valid
 * Input must be:
 *  - A string
 *  - Contain only letters and spaces
 *  - Must start with a letter
 *  - Must not be empty
 * 
 * Regex pattern Supported via standard programming aids
 * 
 * @param {string} input the string to validate
 * @returns true if valid
 */
exports.validateInput =
function (input) {
    const pattern = /^[A-Za-z](?:\s?[A-Za-z]+)*$/;
    return typeof input === "string" && pattern.test(input) && input.length > 0;
};