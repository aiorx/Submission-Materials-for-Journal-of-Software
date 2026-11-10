```typescript
public shouldComponentUpdate(nextProps: IItemRendererWrapProps) {
	// perf is better when we're are specific and not iterating over nextProps and this.props looking for a mismatch
	if (nextProps.item !== this.props.item ||
		nextProps.expanded !== this.props.expanded ||
		nextProps.depth !== this.props.depth ||
		nextProps.itemType !== this.props.itemType ||
		nextProps.children !== this.props.children) {
		return true
	}

	const nextItem: FileEntry = nextProps.itemType === ItemType.File || nextProps.itemType === ItemType.Directory
		? nextProps.item as FileEntry
		: nextProps.itemType === ItemType.RenamePrompt
			? (nextProps.item as RenamePromptHandle).target
			: nextProps.itemType === ItemType.NewFilePrompt || nextProps.itemType === ItemType.NewDirectoryPrompt
				? (nextProps.item as NewFilePromptHandle).parent
				: null

	if ((nextItem && nextItem.path) !== this.lastItemPath) {
		return true
	}
	return false
}
```