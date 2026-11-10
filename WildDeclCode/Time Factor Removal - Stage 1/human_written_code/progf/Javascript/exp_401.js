var _import = require('react');
var render = require('react-dom').render;

require('./index.css');

var LongPress = require('../../src');

const styles = {
  block: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 150,
    backgroundColor: '#ffc1c1',
    margin: 'auto',
    marginBottom: 30,
    padding: 25,
    textAlign: 'center'
  }
};

class Demo extends Component {
  state = {
    pressed: []
  };

  addToPressed = function index { return this.setState({pressed: [...this.state.pressed, index]}); };

  removeFromPressed = function index { return this.setState({pressed: this.state.pressed.filter(i => i !== index)}); };

  render() {
    var pressed = this.state.pressed;

    return (
      <div>
        <div style={{textAlign: 'center'}}>
          <h1>react-long Demo</h1>
          <h3>(works only on mobile)</h3>
        </div>

        <div>
          {Array.from({length: 10}).map(function (t, i) { return (
            <LongPress
              key={i}
              time={500}
              onLongPress={() => this.addToPressed(i)}
              onPress={() => this.removeFromPressed(i)}
            >
              <div
                style={{
                  ...styles.block,
                  ...(pressed.indexOf(i) !== -1 && {
                    backgroundColor: '#a5d4ab'
                  })
                }}
              >
                <div>
                  <div>
                    {pressed.indexOf(i) === -1
                      ? 'Long press me'
                      : 'Now short press me'}
                  </div>
                </div>
              </div>
            </LongPress>
          ); })}
        </div>
      </div>
    );
  }
}

render(<Demo />, document.querySelector('#demo'));
