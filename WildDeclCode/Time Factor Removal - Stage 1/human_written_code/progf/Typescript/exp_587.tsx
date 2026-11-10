// eslint-disable-next-line simple-import-sort/imports
import {
  plugins,
  schema,
  toolbar,
} from '@aeaton/react-prosemirror-config-default'
import {
  ChangeHandler,
  Editor,
  EditorProvider,
  Floater,
  HtmlEditor,
  Toolbar,
  useDebounce,
} from '@aeaton/react-prosemirror'
import {
  createHTMLTransformer,
  createJSONTransformer,
  createNullTransformer,
} from '@aeaton/prosemirror-transformers'
var ProsemirrorNode = require('prosemirror-model').Node;
var _import = require('react');

require('./styles/demo.css');
require('./styles/prosemirror.css');

var htmlTransformer = createHTMLTransformer(schema)
var jsonTransformer = createJSONTransformer(schema)
var nullTransformer = createNullTransformer()

var initialValue = "<p></p>"
var initialDoc = htmlTransformer.parse(initialValue)

var floatingTools = toolbar.slice(0, 2)
var fixedTools = toolbar.slice(2)

// TODO: nodeviews, perhaps displaying a node type switcher alongside each node?

var App: React.FC = function () {
  var [doc, setDoc] = useState<ProsemirrorNode>(initialDoc)

  var [html, setHTML] = useState<string>(initialValue)

  return (
    <div>
      <div className="prosemirror-demo">
        <div className="prosemirror-demo-editor">
          <HtmlEditor
            schema={schema}
            plugins={plugins}
            value={initialValue}
            handleChange={setHTML}
            debounce={1000}
          >
            <Toolbar toolbar={toolbar} />
            <Editor autoFocus />
          </HtmlEditor>
        </div>
        <div className="prosemirror-demo-output">
          <pre>{html}</pre>
        </div>
      </div>

      <div className="prosemirror-demo">
        <div className="prosemirror-demo-editor">
          <EditorProvider plugins={plugins} doc={initialDoc}>
            <ChangeHandler
              handleChange={setDoc}
              transformer={nullTransformer}
            />
            <Toolbar toolbar={fixedTools} />
            <Floater>
              <Toolbar toolbar={floatingTools} />
            </Floater>
            <Editor autoFocus />
          </EditorProvider>
        </div>
        {doc !== undefined && (
          <div className="prosemirror-demo-output">
            <JSONOutput doc={doc} />
            <HTMLOutput doc={doc} />
          </div>
        )}
      </div>
    </div>
  )
}

var JSONOutput: React.FC<{ doc: ProsemirrorNode }> = function ({ doc }) {
  var debouncedDoc = useDebounce(doc, 1000)

  var json = useMemo(() => jsonTransformer.serialize(debouncedDoc), [
    debouncedDoc,
  ])

  return (
    <div className="output">
      <pre>{json}</pre>
    </div>
  )
}

var HTMLOutput: React.FC<{ doc: ProsemirrorNode }> = function ({ doc }) {
  var [html, setHTML] = useState('')

  // serialize when the button is clicked
  var handleClick = () => {
    setHTML(htmlTransformer.serialize(doc))
  }

  return (
    <div className="output">
      <button type="button" onClick={handleClick}>
        Show HTML
      </button>
      <pre>{html}</pre>
    </div>
  )
}
