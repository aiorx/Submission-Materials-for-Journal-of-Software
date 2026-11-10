var ChangeEvent = require('react').ChangeEvent;
var Component = require('react').Component;

type CounterProps = {
  incident: string;
};

type CounterState = {
  count: number;
};

class Counter extends Component<CounterProps, CounterState> {
  state: CounterState = {
    count: 0
  };

  increment = function () {
    this.setState(({ count }) => ({ count: count + 1 }));
  };

  decrement = function () {
    this.setState(({ count }) => ({ count: count - 1 }));
  };

  reset = function () {
    this.setState({ count: 0 });
  };

  changeCount = function (event: ChangeEvent<HTMLInputElement>) {
    this.setState({ count: +event.target.value });
  };

  render() {
    var incident = this.props.incident;
    var count = this.state.count;

    return (
      <main className="Counter">
        <h1>Days Since Last {incident}</h1>
        <p className="count">{count}</p>
        <section className="controls">
          <button onClick={this.increment}>Increment</button>
          <button onClick={this.reset}>Reset</button>
          <button onClick={this.decrement}>Decrement</button>
        </section>
        <section className="controls">
          <form
            onSubmit={function (event) {
              event.preventDefault();
            }}
          >
            <label htmlFor="set-to">Set Count</label>
            <input id="set-to" type="number" />
          </form>
        </section>
      </main>
    );
  }
}

class Application extends Component {
  render() {
    return <Counter incident={'Coffee Spill'} />;
  }
}

module.exports = Application;
