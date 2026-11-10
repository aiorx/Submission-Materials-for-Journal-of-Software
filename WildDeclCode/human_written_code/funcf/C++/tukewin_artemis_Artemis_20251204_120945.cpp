```cpp
bool CArtemis::IsDebuggerPresentPatched()
{
	HMODULE hKernel32 = GetModuleHandleA("kernel32.dll");
	if (!hKernel32)
		return false;

	FARPROC pIsDebuggerPresent = GetProcAddress(hKernel32, "IsDebuggerPresent");
	if (!pIsDebuggerPresent)
		return false;

	HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
	if (INVALID_HANDLE_VALUE == hSnapshot)
		return false;

	PROCESSENTRY32W ProcessEntry;
	ProcessEntry.dwSize = sizeof(PROCESSENTRY32W);

	if (!Process32FirstW(hSnapshot, &ProcessEntry))
		return false;

	bool bDebuggerPresent = false;
	HANDLE hProcess = NULL;
	DWORD dwFuncBytes = 0;
	const DWORD dwCurrentPID = GetCurrentProcessId();
	do
	{
		__try
		{
			if (dwCurrentPID == ProcessEntry.th32ProcessID)
				continue;

			hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, ProcessEntry.th32ProcessID);
			if (NULL == hProcess)
				continue;

			if (!ReadProcessMemory(hProcess, pIsDebuggerPresent, &dwFuncBytes, sizeof(DWORD), NULL))
				continue;

			if (dwFuncBytes != *( PDWORD ) pIsDebuggerPresent)
			{
				bDebuggerPresent = true;
				break;
			}
		}
		__finally
		{
			if (hProcess)
				CloseHandle(hProcess);
			else
			{

			}
		}
	} while (Process32NextW(hSnapshot, &ProcessEntry));

	if (hSnapshot)
		CloseHandle(hSnapshot);

	return bDebuggerPresent;
}
```