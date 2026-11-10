var hashObjectGenerator = require('object-hash');
var _import = require('react');
var StyleSheet = require('react-native').StyleSheet;
var Text = require('react-native').Text;
var View = require('react-native').View;
var Node = require('../node-view').Node;
var NodeView = require('../node-view').NodeView;
var NodeProvider = require('../nodes-context-provider').NodeProvider;

const styles = StyleSheet.create({
  errorContainer: {
    borderColor: 'rgb(84, 85, 86)',
    backgroundColor: 'rgb(237, 57, 40)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  errorText: {
    color: 'rgb(255, 255, 255)',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export interface IProps {
  data: any;
  extraData?: any;
  renderNode: function (item: Node, level: number, isLastLevel: boolean) { return ReactElement; };
  onNodePressed?: function (item: Node) { return void; };
  getChildrenName?: function (item: Node) { return string; };
  style?: StyleSheet;
  keepOpenedState?: boolean;
  initialNumToRender?: number;
}

const DEFAULT_CHILDREN_NAME = 'items';

const defaultRootNode = {
  _internalId: 'root',
  items: [],
  name: 'root',
  opened: true,
  hidden: true,
} as Node;

const NestedListView: React.FC<IProps> = React.memo(
  function ({
    getChildrenName,
    renderNode,
    data,
    onNodePressed,
    extraData,
    keepOpenedState,
    initialNumToRender,
  }: IProps) {
    const generateIds = useCallback(
      (node?: Node) => {
        if (!node) {
          return {
            _internalId: '',
          };
        }

        const copyNode = { ...node };

        const childrenName = getChildrenName
          ? getChildrenName(node)
          : DEFAULT_CHILDREN_NAME;
        let children = node[childrenName];

        if (children) {
          if (!Array.isArray(children)) {
            children = Object.keys(children).map(
              (key: string) => children[key],
            );
          }
          copyNode[childrenName] = children.map((_: Node, index: number) =>
            generateIds(children[index]),
          );
        }

        if (copyNode._internalId) {
          // @ts-ignore
          delete copyNode._internalId;
        }

        copyNode._internalId = hashObjectGenerator(copyNode, {
          algorithm: 'passthrough',
          unorderedSets: false,
          unorderedObjects: false,
        });

        return copyNode;
      },
      [getChildrenName],
    );

    const generateRootNode = useCallback(
      (props: IProps): Node => {
        return {
          _internalId: 'root',
          items: props.data
            ? props.data.map((item: any) => generateIds(item))
            : [],
          name: 'root',
          opened: true,
          hidden: true,
        };
      },
      [generateIds],
    );

    const [_root, setRoot]: [Node, (_rootNode: Node) => void] =
      useState(defaultRootNode);

    useEffect(() => {
      setRoot(
        generateRootNode({
          getChildrenName,
          renderNode,
          data,
          onNodePressed,
          extraData,
        }),
      );
    }, [
      data,
      extraData,
      getChildrenName,
      renderNode,
      onNodePressed,
      generateRootNode,
    ]);

    const _getChildrenName = useCallback(
      (node: Node) => {
        if (node.name === 'root') {
          return 'items';
        }

        return getChildrenName ? getChildrenName(node) : 'items';
      },
      [getChildrenName],
    );

    const renderErrorMessage = (prop: string) => {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>prop {prop} has not been passed</Text>
        </View>
      );
    };

    if (!renderNode) {
      return renderErrorMessage('renderNode');
    }

    if (!data) {
      return renderErrorMessage('data');
    }

    return (
      <NodeProvider>
        <NodeView
          getChildrenName={_getChildrenName}
          node={_root}
          onNodePressed={onNodePressed}
          level={0}
          renderNode={renderNode}
          extraData={extraData}
          keepOpenedState={keepOpenedState}
          initialNumToRender={initialNumToRender}
        />
      </NodeProvider>
    );
  },
);

NestedListView.displayName = 'NestedListView';

module.exports.NestedListView = NestedListView;
