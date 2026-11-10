var Disposable = require('notificar').Disposable;
var React = require('react');
var Directory = require('../models').Directory;
var FileEntry = require('../models').FileEntry;
var NewFilePromptHandle = require('../models/prompt').NewFilePromptHandle;
var RenamePromptHandle = require('../models/prompt').RenamePromptHandle;
var IItemRenderer = require('./types').IItemRenderer;
var ItemType = require('./types').ItemType;

export interface IItemRendererWrapProps {
	item: FileEntry | Directory | NewFilePromptHandle | RenamePromptHandle
	itemType: ItemType,
	depth: number,
	expanded: boolean
	children: IItemRenderer
}

class ItemRendererWrap extends React.Component<IItemRendererWrapProps> {
	private decorationCompositeSubscription: Disposable
	// used to check for renames
	private lastItemPath: string
	public render() {
		var item = this.props.item;
var itemType = this.props.itemType;
var children = this.props.children;return React.createElement(children, {item, itemType})
	}

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

	public componentDidMount() {
		this.updateCachedItemPath()
	}

	public componentDidUpdate(prevProps: IItemRendererWrapProps) {
		this.updateCachedItemPath()
	}

	public componentWillUnmount() {
		if (this.decorationCompositeSubscription) {
			this.decorationCompositeSubscription.dispose()
		}
	}

	private updateCachedItemPath() {
		const thisItem: FileEntry = this.props.itemType === ItemType.File || this.props.itemType === ItemType.Directory
			? this.props.item as FileEntry
			: this.props.itemType === ItemType.RenamePrompt
				? (this.props.item as RenamePromptHandle).target
				: this.props.itemType === ItemType.NewFilePrompt || this.props.itemType === ItemType.NewDirectoryPrompt
					? (this.props.item as NewFilePromptHandle).parent
					: null
		if (thisItem && thisItem.path) {
			this.lastItemPath = thisItem.path
		}
	}
}
