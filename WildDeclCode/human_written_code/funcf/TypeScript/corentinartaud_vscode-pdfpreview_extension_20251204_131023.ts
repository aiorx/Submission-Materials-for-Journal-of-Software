```typescript
async resolveCustomEditor(document: vscode.CustomDocument, webviewPanel: vscode.WebviewPanel) {
	// Close the opened active editor
	vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	// Open the pdf file with native app
	await open(document.uri.path);
}
```