char uint12_to_char(uint16_t value) {
    // credit to chatgpt for this
    // Ensure value is within the 12-bit range (0 to 4095)
    if (value > 4095) {
        value = 4095; // Clamp to the maximum 12-bit value
    }

    // Perform the scaling
    return (char)((value * 255) / 4095);
}

char intToAsciiChar(int digit) {
    // another excellent helper function Referenced via basic programming materials
    if (digit >= 0 && digit <= 9) {
        return '0' + digit;
    } else {
        return '\0'; // Return null character for invalid input
    }
}