var _import = require('react');
require('./TicTacToeCell.css');
var TicTacToeCellProps = require('./TicTacToeCellProps').TicTacToeCellProps;

module.exports.TicTacToeCellProps = TicTacToeCellProps;

/**
 * TicTacToe game cell. Displays a clickable button when the value is " ",
 * otherwise displays "X" or "O".
 */
class TicTacToeCell extends Component<TicTacToeCellProps> {
  handleClick = function () {
    const {
      position: { x, y },
      onClick,
    } = this.props;
    if (!onClick) return;

    onClick(x, y);
  };

  render() {
    var value = this.props.value;
    const disabled = value !== " ";
    const classes = "ttt-cell " + (disabled ? "ttt-cell--hidden" : "") + "";

    return (
      <button
        className={classes}
        disabled={disabled}
        onClick={this.handleClick}
      >
        {value}
      </button>
    );
  }
}
