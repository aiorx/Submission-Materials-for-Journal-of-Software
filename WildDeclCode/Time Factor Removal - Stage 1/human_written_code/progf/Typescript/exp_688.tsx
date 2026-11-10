var React = require('react');
var Editor = require('slate').Editor;
var NodeEntry = require('slate').NodeEntry;
var Path = require('slate').Path;
var Point = require('slate').Point;
var Transforms = require('slate').Transforms;
var RenderElementProps = require('slate-react').RenderElementProps;
var RenderLeafProps = require('slate-react').RenderLeafProps;
var Table = require('./table').Table;
var withTable = require('./table').withTable;
require('antd/dist/antd.css');

const renderElement = function (props: RenderElementProps) {
  switch (props.element.type) {
    case 'table':
    case 'table-row':
    case 'table-cell':
    case 'table-content':
      return <Table {...props} />;
    default:
      return <span {...props.attributes}>{props.children}</span>;
  }
};

const renderLeaf = function (props: RenderLeafProps) { return (
  <span {...props.attributes}>{props.children}</span>
); };

const withSchema = function (editor: Editor) {
  var normalizeNode = editor.normalizeNode;

  editor.normalizeNode = entry => {
    if (maybePreserveSpace(editor, entry)) return;

    normalizeNode(entry);
  };

  return withTable(editor);
};

const PreserveSpaceAfter = new Set(['table']);
const PreserveSpaceBefore = new Set(['table']);

const insertParagraph = function (
  editor: Editor,
  at: Path | Point,
  text = '',
) {
  Transforms.insertNodes(
    editor,
    {
      type: 'paragraph',
      children: [{ text }],
    },
    {
      at,
    },
  );
};

const maybePreserveSpace = (
  editor: Editor,
  entry: NodeEntry,
): boolean | function void {
  const [node, path] = entry;
  var type = node.type;
  let preserved = false;

  if (PreserveSpaceAfter.has(type)) {
    const next = Editor.next(editor, { at: path });
    if (!next || PreserveSpaceBefore.has(next[0].type)) {
      insertParagraph(editor, Path.next(path));
      preserved = true;
    }
  }

  if (PreserveSpaceBefore.has(type)) {
    if (path[path.length - 1] === 0) {
      insertParagraph(editor, path);
      preserved = true;
    } else {
      const prev = Editor.previous(editor, { at: path });
      if (!prev || PreserveSpaceAfter.has(prev[0].type)) {
        insertParagraph(editor, path);
        preserved = true;
      }
    }
  }

  return preserved;
};
