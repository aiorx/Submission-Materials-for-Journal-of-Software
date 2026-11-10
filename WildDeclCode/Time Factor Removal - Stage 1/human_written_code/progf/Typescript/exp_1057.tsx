var _import = require('react');
var isBrowser = require('umi').isBrowser;
var _import = require('@aomao/engine');

const ContentRender = function ({ content }: { content: string }) {
	const contentView = useRef<ContentViewInterface>();
	const viewRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (viewRef.current && !contentView.current) {
			//初始化
			contentView.current = new ContentView(viewRef.current, {
				card: Engine.card,
				plugin: Engine.plugin,
			});
		}
	}, []);

	useEffect(() => {
		if (contentView.current) {
			//渲染内容到viewRef节点下
			contentView.current.render(content);
		}
	}, [content]);

	//服务端渲染
	const renderServer = () => {
		const container = $('<div></div>');
		const view = new ContentView(container, {
			card: Engine.card,
			plugin: Engine.plugin,
		});
		//渲染内容到container节点下
		view.render(content);
		return (
			<div
				className={container.attr('class')}
				dangerouslySetInnerHTML={{ __html: container.html() }}
			></div>
		);
	};
	//普通渲染
	const render = () => {
		return <div ref={viewRef} />;
	};
	return isBrowser() ? render() : renderServer();
};

module.exports = ContentRender;
