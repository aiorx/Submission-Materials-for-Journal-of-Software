```typescript
private getJson(): string {
    let json: string = "";
    if (this._currentEditor) {
        json = this._currentEditor.document.getText();
    }
    return json;
}
```