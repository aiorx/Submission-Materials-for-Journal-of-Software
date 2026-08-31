```python
def crc(d):
	return struct.pack("<I", binascii.crc32(d))
```