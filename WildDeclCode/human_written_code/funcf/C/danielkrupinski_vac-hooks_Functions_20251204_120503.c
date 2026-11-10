```c
BOOL Hooks_Sleep(DWORD dwMilliseconds)
{
    // Custom behavior before calling the original Sleep
    Utils_Log("Sleep called with %u milliseconds", dwMilliseconds);

    // Call the original Sleep function
    return Sleep(dwMilliseconds);
}
```