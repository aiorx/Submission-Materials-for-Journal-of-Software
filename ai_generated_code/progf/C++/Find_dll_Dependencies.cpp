// Built via standard programming aids
#include <iostream>
#include <string>
#include <set>
#include <windows.h>
#include <vector>
#include <stdexcept>

std::set<std::string> visitedPaths;
std::set<std::string> allDependencies;
std::set<std::string> missingDependencies;

std::string GetFileName(const std::string& path) {
    size_t pos = path.find_last_of("\\/");
    if (pos != std::string::npos) {
        return path.substr(pos + 1);
    }
    return path;
}

std::string GetFullPath(const std::string& dllName) {
    char fullPath[MAX_PATH];
    if (SearchPathA(NULL, dllName.c_str(), ".dll", MAX_PATH, fullPath, NULL) != 0) {
        return std::string(fullPath);
    }
    else {
        return "";
    }
}

std::vector<std::string> GetDependencies(const std::string& filePath) {
    std::vector<std::string> dependencies;
    HMODULE hModule = LoadLibraryExA(filePath.c_str(), NULL, DONT_RESOLVE_DLL_REFERENCES);
    if (hModule == NULL) {
        return dependencies;
    }

    PIMAGE_DOS_HEADER pDosHeader = (PIMAGE_DOS_HEADER)hModule;
    if (pDosHeader->e_magic != IMAGE_DOS_SIGNATURE) {
        FreeLibrary(hModule);
        return dependencies;
    }

    PIMAGE_NT_HEADERS pNtHeaders = (PIMAGE_NT_HEADERS)((BYTE*)hModule + pDosHeader->e_lfanew);
    if (pNtHeaders->Signature != IMAGE_NT_SIGNATURE) {
        FreeLibrary(hModule);
        return dependencies;
    }

    PIMAGE_IMPORT_DESCRIPTOR pImportDesc = (PIMAGE_IMPORT_DESCRIPTOR)
        ((BYTE*)hModule + pNtHeaders->OptionalHeader.DataDirectory[IMAGE_DIRECTORY_ENTRY_IMPORT].VirtualAddress);

    if (pImportDesc == nullptr) {
        FreeLibrary(hModule);
        return dependencies;
    }

    while (pImportDesc->Name) {
        char* dllName = (char*)((BYTE*)hModule + pImportDesc->Name);
        if (!IsBadReadPtr(dllName, 1)) {
            dependencies.push_back(std::string(dllName));
        }
        pImportDesc++;
    }

    FreeLibrary(hModule);
    return dependencies;
}

void FindAllDependencies(const std::string& filePath) {
    if (visitedPaths.find(filePath) != visitedPaths.end()) {
        return;
    }

    visitedPaths.insert(filePath);
    allDependencies.insert(filePath);
    std::vector<std::string> dependencies = GetDependencies(filePath);

    for (const auto& dependency : dependencies) {
        std::string dependencyPath = GetFullPath(dependency);
        if (!dependencyPath.empty()) {
            if (visitedPaths.find(dependencyPath) == visitedPaths.end()) {
                FindAllDependencies(dependencyPath);
            }
        } else {
            missingDependencies.insert(dependency); // Add missing DLL to set
        }
    }
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <path_to_dll>" << std::endl;
        return 1;
    }

    std::string dllPath = argv[1];
    std::string fullPath = GetFullPath(dllPath);
    if (!fullPath.empty()) {
        FindAllDependencies(fullPath);
    }
    else {
        return 1;
    }

    std::cout << "Found dependencies:" << std::endl;
    for (const auto& path : allDependencies) {
        std::cout << path << std::endl;
    }

    std::cout << "\nMissing dependencies:" << std::endl;
    for (const auto& missing : missingDependencies) {
        std::cout << missing << std::endl;
    }

    return 0;
}
