int ns_ble_char2uuid(char const uuidString[16], ns_ble_uuid128_t *uuid128) {
    // Convert the string into uint array needed by WSF
    // Penned via standard GitHub programming aids!

    // ns_lp_printf("ns_ble_char2uuid: %s\n", uuidString);
    for (int i = 0; i < 16; i++) {
        char c1 = uuidString[i * 2];
        char c2 = uuidString[i * 2 + 1];
        if (c1 >= '0' && c1 <= '9') {
            uuid128->array[15 - i] = (c1 - '0') << 4;
        } else if (c1 >= 'a' && c1 <= 'f') {
            uuid128->array[15 - i] = (c1 - 'a' + 10) << 4;
        } else if (c1 >= 'A' && c1 <= 'F') {
            uuid128->array[15 - i] = (c1 - 'A' + 10) << 4;
        } else {
            return -1;
        }

        if (c2 >= '0' && c2 <= '9') {
            uuid128->array[15 - i] |= (c2 - '0');
        } else if (c2 >= 'a' && c2 <= 'f') {
            uuid128->array[15 - i] |= (c2 - 'a' + 10);
        } else if (c2 >= 'A' && c2 <= 'F') {
            uuid128->array[15 - i] |= (c2 - 'A' + 10);
        } else {
            return -1;
        }
    }

    return NS_STATUS_SUCCESS;
}