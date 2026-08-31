```cpp
BOOL InjectDLL(DWORD procID, const char* dllPath)
{
    BOOL WPM = 0;

    HANDLE hProc = OpenProcess(PROCESS_ALL_ACCESS, 0, procID);
    if (hProc == INVALID_HANDLE_VALUE)
    {
        return -1;
    }
    void* loc = VirtualAllocEx(hProc, 0, MAX_PATH, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
    WPM = WriteProcessMemory(hProc, loc, dllPath, strlen(dllPath) + 1, 0);
    if (!WPM)
    {
        CloseHandle(hProc);
        return -1;
    }
    print("DLL Injected Succesfully 0x%lX\n", WPM);
    HANDLE hThread = CreateRemoteThread(hProc, 0, 0, (LPTHREAD_START_ROUTINE)LoadLibraryA, loc, 0, 0);
    if (!hThread)
    {
        VirtualFree(loc, strlen(dllPath) + 1, MEM_RELEASE);
        CloseHandle(hProc);
        return -1;
    }
    print("Thread Created Succesfully 0x%lX\n", hThread);
    CloseHandle(hProc);
    VirtualFree(loc, strlen(dllPath) + 1, MEM_RELEASE);
    CloseHandle(hThread);
    return 0;
}
```