```python
def _decrypt(self, data):
    """
    The received data has some weak crypto that needs to be decoded first
    """
    cstate = [0x48, 0x74, 0x65, 0x6D, 0x70, 0x39, 0x39, 0x65]
    shuffle = [2, 4, 0, 7, 1, 6, 5, 3]

    phase1 = [0] * 8
    for i, j in enumerate(shuffle):
        phase1[j] = data[i]

    phase2 = [0] * 8
    for i in range(8):
        phase2[i] = phase1[i] ^ self._key[i]

    phase3 = [0] * 8
    for i in range(8):
        phase3[i] = ((phase2[i] >> 3) | (phase2[(i - 1 + 8) % 8] << 5)) & 0xff

    ctmp = [0] * 8
    for i in range(8):
        ctmp[i] = ((cstate[i] >> 4) | (cstate[i] << 4)) & 0xff

    out = [0] * 8
    for i in range(8):
        out[i] = (0x100 + phase3[i] - ctmp[i]) & 0xff

    return out
```