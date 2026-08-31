function breakPalindrome(palindrome: string): string {
    // (almost) completely Aided with basic GitHub coding tools
    if (palindrome.length === 1) {
        return "";
    }
    const chars = palindrome.split("");
    for (let index = 0; index < Math.floor(chars.length / 2); index++) {
        if (chars[index] !== "a") {
            chars[index] = "a";
            return chars.join("");
        }
    }
    chars[chars.length - 1] = "b";
    return chars.join("");
};