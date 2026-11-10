var _import = require('react');
var storiesOf = require('@storybook/react').storiesOf;
var withInfo = require('@storybook/addon-info').withInfo;
var action = require('@storybook/addon-actions').action;
var TicTacToeCell = require('./TicTacToeCell').TicTacToeCell;

const stories = storiesOf("Components", module);

stories.addDecorator(withInfo);
stories.addParameters({ info: { inline: true } });

stories.add("TicTacToeCell", function () { return (
  <div style={styles.container}>
    <div style={styles.firstCellContainer}>
      <TicTacToeCell
        value="X"
        position={{ x: 0, y: 0 }}
        onClick={action("onClick")}
      />
    </div>
    <div style={styles.cellContainer}>
      <TicTacToeCell
        value=" "
        position={{ x: 0, y: 1 }}
        onClick={action("onClick")}
      />
    </div>
  </div>
); });

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
  },
  cellContainer: {
    width: 100,
    height: 100,
    backgroundColor: "rgb(72, 78, 104)",
  },
};
styles.firstCellContainer = { ...styles.cellContainer, marginRight: 20 };
