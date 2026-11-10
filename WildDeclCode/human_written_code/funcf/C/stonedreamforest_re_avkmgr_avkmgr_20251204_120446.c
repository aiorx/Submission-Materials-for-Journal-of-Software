```c
extern AVKMGR_EXPORT NTSTATUS func0(__int64 Exchange) {
	for (int i = 0; i < 4; i++) {
		if (!_InterlockedCompareExchange64((volatile LONG64 *)(&g_FunTable.sub_1F0)[i] , Exchange , 0)) {
			return 0;
		}
	}
	return 0x0C0000001;
}
```