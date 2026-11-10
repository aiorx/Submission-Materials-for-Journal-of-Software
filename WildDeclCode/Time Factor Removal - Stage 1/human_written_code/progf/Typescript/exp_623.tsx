var _import = require('react');
import ReactFlow, {
  addEdge,
  ConnectionMode,
  Elements,
  FlowElement,
  ReactFlowProvider,
  removeElements,
} from "react-flow-renderer";
var CorkboardPlugin = require('../index');
var CorkboardNote = require('./types').CorkboardNote;
var nodeTypes = require('./types').nodeTypes;
var noteNodeTypeString = require('./types').noteNodeTypeString;
var SettingsForm = require('./SettingsForm');
var AppContext = require('./context').AppContext;
var EditModeContext = require('./context').EditModeContext;

interface CorkboardProps {
  plugin: CorkboardPlugin;
}

module.exports = function Corkboard({ plugin }: CorkboardProps): JSX.Element {;
  const [reactflowInstance, setReactflowInstance] = useState(null);
  const [numNodes, setNumNodes] = useState("12");
  const [elements, setElements] = useState<Elements<CorkboardNote>>([]);
  const [editMode, setEditMode] = useState(false);

  const onConnect = useCallback(function (params) {
    setElements((els) => addEdge({ ...params }, els));
  }, []);

  const onElementClick = function (e: any, element: FlowElement) {
    var data = element.data;
    if (e.ctrlKey || e.metaKey) {
      plugin.app.workspace.openLinkText(data.path, "", true, false);
    }
  };

  const onElementsRemove = function (elementsToRemove: Elements) { return setElements((els) => removeElements(elementsToRemove, els)); };

  const onLoad = useCallback(
    function (rfi: any) {
      if (!reactflowInstance) {
        setReactflowInstance(rfi);
      }
      setElements(elements);
    },
    [reactflowInstance]
  );

  const onDoubleClick = useCallback(
    function (e: any) {
      if (e.target.className == "react-flow__pane") {
        const currentTargetRect = e.currentTarget.getBoundingClientRect();
        const position = {
          x: e.screenX - 0.5 * currentTargetRect.width,
          y: e.screenY - 0.5 * currentTargetRect.height + 80,
        };
        const newElements = elements.map((e) => {
          return { ...e };
        });
        newElements.push({
          id: "" + (elements.length) + "",
          data: {
            file: null,
            label: "",
            path: "",
          },
          type: noteNodeTypeString,
          position,
        });
        setElements(newElements);
      }
    },
    [elements]
  );

  return (
    <ReactFlowProvider>
      <AppContext.Provider value={plugin.app}>
        <EditModeContext.Provider value={{ editMode, setEditMode }}>
          <div
            className="Corkboard__container"
            style={{ width: "1080px", height: "800px" }}
          >
            {elements && (
              <ReactFlow
                elements={elements}
                nodeTypes={nodeTypes}
                onConnect={onConnect}
                onElementClick={onElementClick}
                onElementsRemove={onElementsRemove}
                onLoad={onLoad}
                elementsSelectable={true}
                selectionKeyCode={null}
                deleteKeyCode={"Backspace"}
                multiSelectionKeyCode={"Shift"}
                connectionMode={ConnectionMode.Loose}
                onDoubleClick={onDoubleClick}
                zoomOnDoubleClick={false}
              />
            )}
          </div>
          <SettingsForm
            plugin={plugin}
            numNodes={numNodes}
            setNumNodes={setNumNodes}
            setElements={setElements}
          />
        </EditModeContext.Provider>
      </AppContext.Provider>
    </ReactFlowProvider>
  );
}
