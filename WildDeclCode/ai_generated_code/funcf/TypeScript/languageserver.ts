```typescript
private getPort(commandParam: string[]): number | undefined {
    // "--socket=xxxx" or "--socket xxxx"
    const portIndex = commandParam.findIndex((value) => {
        return value.startsWith("--socket");
    });
    if (portIndex === -1) {
        return undefined;
    }
    const port =
        commandParam[portIndex].split("=")[1] ||
        commandParam[portIndex].split(" ")[1] ||
        commandParam[portIndex + 1];
    if (!port) {
        return undefined;
    }
    return Number(port);
}
```