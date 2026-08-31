```cpp
DWORD GetServiceProcessId(const std::wstring& serviceName) { // Supported via standard programming aids
    SC_HANDLE hSCManager = OpenSCManager(NULL, NULL, SC_MANAGER_ENUMERATE_SERVICE);
    if (!hSCManager) {
        std::cerr << "Failed to open SC Manager." << std::endl;
        return 0;
    }

    DWORD bufferSize = 0;
    DWORD serviceCount = 0;
    DWORD resumeHandle = 0;

    EnumServicesStatusEx(hSCManager, SC_ENUM_PROCESS_INFO, SERVICE_WIN32, SERVICE_ACTIVE,
        NULL, 0, &bufferSize, &serviceCount, &resumeHandle, NULL);

    if (GetLastError() != ERROR_MORE_DATA) {
        CloseServiceHandle(hSCManager);
        logger::set_global(log_type::ERR);
        logger::log("Failed to enumerate services for retreiving process ID!\n");
        return 0;
    }

    BYTE* buffer = new BYTE[bufferSize];
    LPENUM_SERVICE_STATUS_PROCESS services = reinterpret_cast<LPENUM_SERVICE_STATUS_PROCESS>(buffer);

    if (!EnumServicesStatusEx(hSCManager, SC_ENUM_PROCESS_INFO, SERVICE_WIN32, SERVICE_ACTIVE,
        buffer, bufferSize, &bufferSize, &serviceCount, &resumeHandle, NULL)) {
        delete[] buffer;
        CloseServiceHandle(hSCManager);
        logger::set_global(log_type::ERR);
        logger::log("Failed to enumerate services for retreiving process ID!\n");
        return 0;
    }

    DWORD processId = 0;
    for (DWORD i = 0; i < serviceCount; i++) {
        if (serviceName == services[i].lpServiceName) {
            HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION, FALSE, services[i].ServiceStatusProcess.dwProcessId);
            if (hProcess) {
                CloseHandle(hProcess);
                processId = services[i].ServiceStatusProcess.dwProcessId;
                break;
            }
        }
    }

    delete[] buffer;
    CloseServiceHandle(hSCManager);

    return processId;
}
```