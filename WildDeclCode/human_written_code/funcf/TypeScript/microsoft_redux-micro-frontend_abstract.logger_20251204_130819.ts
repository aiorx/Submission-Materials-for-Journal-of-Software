```typescript
SetNextLogger(nextLogger: AbstractLogger) {
    if (nextLogger === undefined || nextLogger === null)
        return;
    if (!this.isLoggerLoopCreated(nextLogger)) {
        if (this.NextLogger === undefined || this.NextLogger === null) {
            this.NextLogger = nextLogger;
        } else {
            this.NextLogger.SetNextLogger(nextLogger);
        }
    }
}
```