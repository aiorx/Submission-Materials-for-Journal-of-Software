```js
const readUDPHeader = (buffer, offset = 20) => {
    const portSrc = buffer.readUint16BE(offset)
    offset += 16 / 8
    const portDst = buffer.readUint16BE(offset)
    offset += 16 / 8
    const length = buffer.readUint16BE(offset)
    offset += 16 / 8
    const checksum = buffer.readUint16BE(offset)
    offset += 16 / 8
    return {
        portSrc,
        portDst,
        length,
        checksum
    }
}
```