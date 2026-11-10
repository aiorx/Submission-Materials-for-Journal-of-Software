```typescript
private onDataReceived = (buffer: Buffer) => {
	if (this.state === 'connection') {
		if (buffer.length === 4 || buffer.length === 120) {
			this.state = 'login';

			if (buffer.length === 120) {
				this.onDataReceived(buffer.slice(4));
			}
		} else {
			this.close();
		}
	} else {
		packetSecurity.decrypt(buffer);

		packet.controller(this, buffer);
	}
};
```