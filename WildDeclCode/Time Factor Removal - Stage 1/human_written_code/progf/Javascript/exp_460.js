var _import = require('react');
var ChromePicker = require('react-color').ChromePicker;
var SketchPicker = require('react-color').SketchPicker;

const noop = function () { };

const pickers = {
  chrome: ChromePicker,
  sketch: SketchPicker,
};

module.exports = class ColorPicker extends Component {;
  static defaultProps = {
    onChange: noop,
    onChangeComplete: noop,
    position: 'bottom',
  }

  constructor(props) {
    super();
    this.state = {
      displayColorPicker: false,
      color: props.color,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ color: nextProps.color });
  }
  handleClick = function () {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };
  handleClose = function () {
    this.setState({ displayColorPicker: false });
  };
  handleChange = function (color) {
    this.setState({ color: color.hex });
    this.props.onChange(color.hex, color);
  };
  handleChangeComplete = function (color) {
    this.setState({ color: color.hex });
    this.props.onChangeComplete(color.hex);
  };
  render() {
    var small = this.props.small;
var type = this.props.type;
var position = this.props.position;

    const Picker = pickers[type];

    const styles = {
      color: {
        width: small ? '16px' : '120px',
        height: small ? '16px' : '24px',
        borderRadius: '2px',
        background: this.state.color,
      },
      swatch: {
        padding: '4px',
        background: '#fff',
        borderRadius: '2px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
      wrapper: {
        position: 'inherit',
        zIndex: '100',
      },
    };

    if (position === 'top') {
      styles.wrapper.transform = 'translateY(-100%)';
      styles.wrapper.paddingBottom = 8;
    }

    const swatch = (
      <div style={styles.swatch} onClick={this.handleClick}>
        <div style={styles.color} />
      </div>
    );
    const picker = this.state.displayColorPicker ? (
      <div style={styles.popover}>
        <div style={styles.cover} onClick={this.handleClose} />
        <div style={styles.wrapper}>
          <Picker
            {...this.props}
            color={this.state.color}
            onChange={this.handleChange}
            onChangeComplete={this.handleChangeComplete}
          />
        </div>
      </div>
    ) : null;

    if (position === 'top') {
      return <div>{picker}{swatch}</div>;
    }
    return <div>{swatch}{picker}</div>;
  }
}
