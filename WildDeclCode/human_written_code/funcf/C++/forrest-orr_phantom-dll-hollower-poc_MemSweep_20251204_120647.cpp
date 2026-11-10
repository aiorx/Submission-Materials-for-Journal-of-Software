```cpp
list<MEMORY_BASIC_INFORMATION*> QueryProcessMem(uint32_t dwPid) {
	list<MEMORY_BASIC_INFORMATION*> ProcessMem;
	HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION, false, dwPid);

	if (hProcess != nullptr) {
		MEMORY_BASIC_INFORMATION* pMemInfo = nullptr;

		for (uint8_t* p = nullptr;; p += pMemInfo->RegionSize) {
			pMemInfo = new MEMORY_BASIC_INFORMATION;

			if (VirtualQueryEx(hProcess, p, pMemInfo, sizeof(MEMORY_BASIC_INFORMATION)) == sizeof(MEMORY_BASIC_INFORMATION)) {
				ProcessMem.push_back(pMemInfo);
			}
			else {
				delete pMemInfo;
				break;
			}
		}

		CloseHandle(hProcess);
	}

	return ProcessMem;
}
```