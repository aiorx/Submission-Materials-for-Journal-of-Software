```typescript
vscode.commands.registerCommand('extension.fixSyntaxError', async (lineNumber: number) => {
	let editor = vscode.window.activeTextEditor;
	if (editor) {
		let lineOfCode = editor.document.lineAt(lineNumber);
		let lineOfCodeText = lineOfCode.text;
		// The user has right clicked a highlighted syntax error on this line
		//Ensures that the diagnostics are on the same line as the cursor, therefore only one reference is needed
		let diagnostics = vscode.languages.getDiagnostics(editor.document.uri).filter(diagnostic => diagnostic.severity === vscode.DiagnosticSeverity.Error && diagnostic.range.start.line === lineNumber);
		//Crucial check
		if (diagnostics.length > 0) {
			// Display the line of code
			vscode.window.showInformationMessage('Fixing syntax error: ' + diagnostics[0].message);
			// Replace the line of code with the GPT-3 assisted fix
			let gptAssistedReturnString = await sendErrorToChatGPT(lineOfCodeText);
			let range = lineOfCode.range;
			let match = lineOfCodeText.match(/^\s*/);
			let indentation = match ? match[0] : "";
			if (gptAssistedReturnString !== "unmodified") {
				editor.edit(editBuilder => {
					editBuilder.replace(range, indentation + gptAssistedReturnString);
				});
			}
		}
	}
});
```