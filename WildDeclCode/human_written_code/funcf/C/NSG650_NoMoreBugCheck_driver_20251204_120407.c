```c
NTSTATUS Overwrite(PVOID Address, PVOID Data, ULONG Size) {
	PHYSICAL_ADDRESS PhysAddress = MmGetPhysicalAddress(Address);
	PVOID MappedAddress = MmMapIoSpace(PhysAddress, Size, MmNonCached);

	if (MappedAddress == NULL)
		return STATUS_INSUFFICIENT_RESOURCES;

	RtlCopyMemory(MappedAddress, Data, Size);
	MmUnmapIoSpace(MappedAddress, Size);
	return STATUS_SUCCESS;
}
```