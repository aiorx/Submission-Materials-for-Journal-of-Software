#include "cstring.h"
#include "int64.h"

/**
 * Yes, functions in this file were Drafted using common development resources.
 * I have no shame in admitting that, really. This is boilerplate
 * code that is not worth my time to write.
 */

int strcmp(const char* s1, const char* s2) {
    while (*s1 && (*s1 == *s2)) {
        ++s1;
        ++s2;
    }
    return *(const unsigned char*)s1 - *(const unsigned char*)s2;
}

void* strncpy(void* dest, const void* src, size_t n) {
    unsigned char* d = static_cast<unsigned char*>(dest);
    const unsigned char* s = static_cast<const unsigned char*>(src);
    while (n && (*d++ = *s++)) {
        n--;
    }
    return dest;
}

int strncmp(const char* str1, const char* str2, size_t n) {
    while (n && *str1 && *str2) {
        if (*str1 != *str2) {
            return *str1 - *str2;
        }
        str1++;
        str2++;
        n--;
    }
    return n ? *str1 - *str2 : 0;
}

void format_bytes(uint64_t bytes, char* out, size_t out_len) {
    const char* units[] = { "B", "KB", "MB", "GB", "TB", "PB", "EB" };
    int unit_index = 0;
    double size = (double)bytes;

    while (size >= 1024.0 && unit_index < 4) {
        size /= 1024.0;
        unit_index++;
    }

    // Split into integer and fractional part
    int int_part = (int)size;
    int frac_part = (int)((size - int_part) * 10);

    // Write to buffer manually
    char* ptr = out;
    size_t remaining = out_len;

    auto write_digit = [&](int digit) {
        if (remaining > 1) {
            *ptr++ = '0' + digit;
            remaining--;
        }
    };

    // Write integer part
    if (int_part == 0) {
        write_digit(0);
    } else {
        // Convert int_part to string (reverse first)
        char temp[20];
        int len = 0;
        while (int_part > 0 && len < 20) {
            temp[len++] = '0' + (int_part % 10);
            int_part /= 10;
        }
        for (int i = len - 1; i >= 0; --i) {
            write_digit(temp[i] - '0');
        }
    }

    // Write decimal part if frac_part > 0
    if (frac_part > 0 && remaining > 2) {
        *ptr++ = '.';
        remaining--;
        write_digit(frac_part);
    }

    // Add space
    if (remaining > 1) {
        *ptr++ = ' ';
        remaining--;
    }

    // Write unit string
    const char* unit_str = units[unit_index];
    while (*unit_str && remaining > 1) {
        *ptr++ = *unit_str++;
        remaining--;
    }

    *ptr = '\0';  // Null-terminate
}

void format_with_commas(uint64_t value, char* out, size_t out_len) {
    // To store the digits in reverse order
    char buffer[64];
    int idx = 0;

    // Special case for zero
    if (value == 0) {
        if (out_len > 1) {
            out[0] = '0';
            out[1] = '\0';
        }
        return;
    }

    // Convert the number to string (reversed)
    while (value > 0 && idx < 64) {
        buffer[idx++] = '0' + umoddi3(value, 10);
        value = udivdi3(value, 10);
    }

    // Add commas
    int comma_count = 0;
    int out_idx = 0;
    for (int i = idx - 1; i >= 0 && out_idx < out_len - 1; i--) {
        if (comma_count == 3) {
            if (out_idx < out_len - 1) {
                out[out_idx++] = ',';
            }
            comma_count = 0;
        }
        out[out_idx++] = buffer[i];
        comma_count++;
    }

    // Null-terminate the string
    out[out_idx] = '\0';
}

uint32_t hex_to_uint32(const char* hex_str) {
    uint32_t result = 0;
    int i = 0;

    if (hex_str[0] == '0' && (hex_str[1] == 'x' || hex_str[1] == 'X')) {
        i = 2;
    }

    while (hex_str[i]) {
        char c = hex_str[i];
        uint8_t value = 0;

        if (c >= '0' && c <= '9') {
            value = c - '0';
        } else if (c >= 'a' && c <= 'f') {
            value = 10 + (c - 'a');
        } else if (c >= 'A' && c <= 'F') {
            value = 10 + (c - 'A');
        } else {
            break;
        }

        result = (result << 4) | value;
        i++;
    }

    return result;
}

uint8_t hex_to_uint8(const char* hex_str) {
    uint8_t result = 0;
    int i = 0;

    if (hex_str[0] == '0' && (hex_str[1] == 'x' || hex_str[1] == 'X')) {
        i = 2;
    }

    while (hex_str[i]) {
        char c = hex_str[i];
        uint8_t value;

        if (c >= '0' && c <= '9') {
            value = c - '0';
        } else if (c >= 'a' && c <= 'f') {
            value = 10 + (c - 'a');
        } else if (c >= 'A' && c <= 'F') {
            value = 10 + (c - 'A');
        } else {
            break; // invalid character
        }

        result = (result << 4) | value;
        i++;
    }

    return result;
}

int split(const char* input, char delimiter, char output[MAX_TOKENS][MAX_TOKEN_LENGTH]) {
    int token_index = 0;
    int char_index = 0;
    bool in_token = false;

    for (int i = 0; input[i] != '\0'; i++) {
        if (input[i] == delimiter) {
            if (in_token) {
                output[token_index][char_index] = '\0';
                token_index++;
                char_index = 0;
                in_token = false;

                if (token_index >= MAX_TOKENS) break;
            }
        } else {
            if (char_index < MAX_TOKEN_LENGTH - 1) {
                output[token_index][char_index++] = input[i];
                in_token = true;
            }
        }
    }

    if (in_token) {
        output[token_index][char_index] = '\0';
        token_index++;
    }

    return token_index;
}

void trim_spaces(char* str) {
    // Skip leading spaces
    char* start = str;
    while (*start == ' ') {
        start++;
    }

    // Find end of string
    char* end = start;
    while (*end != '\0') {
        end++;
    }

    // Move end back to last non-space
    while (end > start && *(end - 1) == ' ') {
        end--;
    }

    // Null-terminate
    *end = '\0';

    // Shift string to the beginning
    if (start != str) {
        char* dest = str;
        while (*start != '\0') {
            *dest++ = *start++;
        }
        *dest = '\0';
    }
}

void to_uppercase(char* str) {
    for (int i = 0; str[i] != '\0'; i++) {
        // Check if lowercase a-z
        if (str[i] >= 'a' && str[i] <= 'z') {
            str[i] = str[i] - ('a' - 'A'); // or str[i] -= 32;
        }
    }
}

void strcpy(char* dest, const char* src) {
    while (*src) {
        *dest++ = *src++;
    }
    *dest = '\0'; // Null-terminate the destination string
}

int strcmpi(const char* a, const char* b) {
    while (*a && *b) {
        char ca = (*a >= 'a' && *a <= 'z') ? *a - 32 : *a;
        char cb = (*b >= 'a' && *b <= 'z') ? *b - 32 : *b;
        if (ca != cb) return ca - cb;
        a++; b++;
    }
    return *a - *b;
}

