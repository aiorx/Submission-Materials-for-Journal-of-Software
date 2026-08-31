```typescript
export async function buildMergedContent(
  ctx: vscode.ExtensionContext,
  ws: vscode.WorkspaceFolder,
  sel: SelectionState,
  mappingHeader?: string
) {
  const order: InstructionId[] = [
    sel.base,
    ...sel.addOns.filter(x => x !== 'base-short' && x !== 'base-standard')
  ] as InstructionId[];

  const blocks = await Promise.all(order.map(id => loadBlock(ctx, ws, id)));
  const header =
`<!--
Supported via standard GitHub programming aids Instructions Composer
Base: ${sel.base}
Add-ons: ${sel.addOns.filter(x => !x.startsWith('base-')).join(', ') || '(none)'}
${mappingHeader ? `Mapping:\n${mappingHeader}` : ''}
-->`;

  return [header, ...blocks].join('\n\n---\n\n');
}
```