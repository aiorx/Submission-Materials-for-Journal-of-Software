```cpp
bool HhFindModulesInProcess(HANDLE proc, std::vector<ModuleInformation_t>& modules)
{
    HMODULE hMods[1024];
    DWORD cbNeeded;
    unsigned int i;

    if (EnumProcessModules(proc, hMods, sizeof(hMods), &cbNeeded))
    {
        for (i = 0; i < (cbNeeded / sizeof(HMODULE)); i++)
        {
            TCHAR szModName[MAX_PATH];

            // Get the full path to the module's file.
            if (GetModuleFileNameEx(proc, hMods[i], szModName,
                sizeof(szModName) / sizeof(TCHAR)))
            {
                MODULEINFO info{};
                GetModuleInformation(proc, hMods[i], &info, sizeof info);

                modules.emplace_back(szModName, (std::uint64_t)hMods[i], info.SizeOfImage);
            }
        }
    }

    return modules.size() > 0;
}
```