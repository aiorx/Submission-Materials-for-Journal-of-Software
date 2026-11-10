```c
void uint64_to_string(uint64_t value, char* buffer) {//Assisted with basic coding tools. there may be bugs
    // Start at the end of the buffer and build the string backward
    char* ptr = buffer;
    char* start = buffer;

    // Handle the case where the value is zero
    if (value == 0) {
        *ptr++ = '0';
    }
    else {
        // Extract digits and append them in reverse order
        while (value > 0) {
            *ptr++ = '0' + (value % 10); // Add '0' to convert digit to character
            value /= 10;
        }
    }

    *ptr = '\0'; // Null-terminate the string

    // Reverse the string in place
    char* end = ptr - 1;
    while (start < end) {
        char temp = *start;
        *start++ = *end;
        *end-- = temp;
    }
}

void kprintln_uint64_to_binary(uint64_t value) {//Assisted with basic coding tools. there may be bugs
    for (int i = 63; i >= 0; i--) {
        if (value & (1ULL << i)) {
            kprint("1");
        }
        else {
            kprint("0");
        }

        if (i % 8 == 0 && i != 0) {  // Add space every 8 bits for readability
            kprint(" ");
        }
    }
    kprint("\n");
}

const char scanmap_set1[128] = {//Assisted with basic coding tools
    0,   0,   '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '\b',   '\t', // 0x00 - 0x0F//0x0e is backspace
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\n', 0,   'a', 's', // 0x10 - 0x1F
    'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '`', 0,   '\\', 'z', 'x', 'c', 'v', // 0x20 - 0x2F
    'b', 'n', 'm', ',', '.', '/', 0,   '*', 0,   ' ', 0,   0,   0,   0,   0,   0,   // 0x30 - 0x3F
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   // 0x40 - 0x4F
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   // 0x50 - 0x5F
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0    // 0x60 - 0x6F
};

const char scanmap_set1_upper[128] = {//Assisted with basic coding tools
    0,   0,   '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '\b',   '\t',
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '\n', 0,   'A', 'S',
    'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', '~', 0,   '|', 'Z', 'X', 'C', 'V',
    'B', 'N', 'M', '<', '>', '?', 0,   '*', 0,   ' ', 0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0
};
```