var _import = require('react');
var uuid = require('@sanity/uuid').uuid;
var FormField = require('part:@sanity/components/formfields/default');
var _import = require('part:@sanity/form-builder/patch-event');
var config = require('config:table');
var TableControl = require('./components/TableControl');
var TableInput = require('./components/TableInput');
var TableMenu = require('./components/TableMenu');
var Box = require('@sanity/ui').Box;
var Button = require('@sanity/ui').Button;
var Card = require('@sanity/ui').Card;
var Dialog = require('@sanity/ui').Dialog;
var Flex = require('@sanity/ui').Flex;
var Inline = require('@sanity/ui').Inline;
var Text = require('@sanity/ui').Text;

// This probably isn't necessary anymore
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

const TableComponent: FunctionComponent<RootProps> = function (props) {
  var type = props.type;
var level = props.level;
var value = props.value;
var markers = props.markers;
var onChange = props.onChange;
  const [dialog, setDialog] = useState<{
    type: string;
    callback: () => any;
  } | null>(null);

  const updateValue = (value) => {
    return onChange(PatchEvent.from(set(value)));
  };

  const resetValue = () => {
    return onChange(PatchEvent.from(unset()));
  };

  const createTable = () => {
    const newValue = {
      rows: [
        {
          _type: config.rowType,
          _key: uuid(),
          cells: ['', ''],
        },
        {
          _type: config.rowType,
          _key: uuid(),
          cells: ['', ''],
        },
      ],
    };
    return updateValue({...(value || {}), ...newValue });
  };

  const confirmRemoveTable = () => {
    setDialog({ type: 'table', callback: removeTable });
  };

  const removeTable = () => {
    resetValue();
    setDialog(null);
  };

  const addRows = (count: number = 1) => {
    const newValue = { ...value };
    // Calculate the column count from the first row
    const columnCount = value.rows[0].cells.length;
    for (let i = 0; i < count; i++) {
      // Add as many cells as we have columns
      newValue.rows.push({
        _type: config.rowType,
        _key: uuid(),
        cells: Array(columnCount).fill(''),
      });
    }
    return updateValue(newValue);
  };

  const addRowAt = (index: number = 0) => {
    const newValue = { ...value };
    // Calculate the column count from the first row
    const columnCount = value.rows[0].cells.length;

    newValue.rows.splice(index, 0, {
      _type: config.rowType,
      _key: uuid(),
      cells: Array(columnCount).fill(''),
    })

    return updateValue(newValue);
  };

  const removeRow = (index: number) => {
    const newValue = deepClone(value);
    newValue.rows.splice(index, 1);
    updateValue(newValue);
    setDialog(null);
  };

  const confirmRemoveRow = (index: number) => {
    if (value.rows.length <= 1) return confirmRemoveTable();
    return setDialog({ type: 'row', callback: () => removeRow(index) });
  };

  const confirmRemoveColumn = (index: number) => {
    if (value.rows[0].cells.length <= 1) return confirmRemoveTable();
    return setDialog({ type: 'column', callback: () => removeColumn(index) });
  };

  const addColumns = (count: number) => {
    const newValue = deepClone(value);
    // Add a cell to each of the rows
    newValue.rows.forEach((_, i) => {
      for (let j = 0; j < count; j++) {
        newValue.rows[i].cells.push('');
      }
    });
    return updateValue(newValue);
  };

  const addColumnAt = (index: number) => {
    const newValue = deepClone(value);

    newValue.rows.forEach((_, i) => {
      newValue.rows[i].cells.splice(index, 0, '')
    });

    return updateValue(newValue);
  };

  const removeColumn = (index) => {
    const newValue = deepClone(value);
    newValue.rows.forEach((row) => {
      row.cells.splice(index, 1);
    });
    updateValue(newValue);
    setDialog(null);
  };

  const updateCell = (e, rowIndex, cellIndex) => {
    const newValue = deepClone(value);
    newValue.rows[rowIndex].cells[cellIndex] = e.target.value;
    return updateValue(newValue);
  };

  return (
    <div>
      {dialog && (
        <Dialog
          header={"Remove " + (dialog.type) + ""}
          id="dialog-remove"
          onClose={() => setDialog(null)}
          zOffset={1000}
        >
          <Card padding={4}>
            <Text>Are you sure you want to remove this {dialog.type}?</Text>
            <Box marginTop={4}>
              <Inline space={1} style={{ textAlign: 'right' }}>
                <Button
                  text="Cancel"
                  mode="ghost"
                  onClick={() => setDialog(null)}
                />
                <Button
                  text="Confirm"
                  tone="critical"
                  onClick={() => dialog.callback()}
                />
              </Inline>
            </Box>
          </Card>
        </Dialog>
      )}
      <Flex align="flex-start" justify="space-between">
        <FormField
          label={type.title}
          markers={markers}
          description={type.description}
          level={level}
          __unstable_changeIndicator={false}
        />
        {value?.rows?.length && (
          <TableMenu
            addColumns={addColumns}
            addColumnAt={addColumnAt}
            addRows={addRows}
            addRowAt={addRowAt}
            remove={confirmRemoveTable}
            placement="left"
          />
        )}
      </Flex>
      {value?.rows?.length && <TableInput
        rows={value.rows}
        removeRow={confirmRemoveRow}
        removeColumn={confirmRemoveColumn}
        updateCell={updateCell}
      />}
      {(!value || !value?.rows?.length) && (
        <TableControl create={createTable} />
      )}
    </div>
  );
};

module.exports = forwardRef(function (props: RootProps, ref) { return (;
  <TableComponent {...props} />
); });
