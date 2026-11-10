var createElement = require('react').createElement;
var Component = require('react').Component;
var render = require('react-dom').render;
var demo = require('./unused').demo;
var xyz = require('./unused').xyz;

var styles = require('./app.css');

demo();
xyz();

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			stories: [
				{
					id: 1,
					name: "[Webpack] — Smart Loading Assets For Production",
					url: "https://hackernoon.com/webpack-smart-loading-assets-for-production-3571e0a29c2e",
				},
				{
					id: 2,
					name: "V8 Engine Overview",
					url: "https://medium.com/@MQuy90/v8-engine-overview-7c965731ced4",
				},
			],
		};
	}
	render() {
		var stories = this.state.stories;

		return (
			<div>
				<ul>
					{stories.map(function (story, index) { return (
						<Story key={index} story={story} onRemove={this.removeStory} />
					); })}
				</ul>
			</div>
		);
	}
	removeStory = function story { return () => {
		var stories = this.state.stories;

		const index = stories.findIndex(s => s.id == story.id);
		stories.splice(index, 1);

		this.setState(stories);
	}; };
}

class Story extends Component {
	constructor(props) {
		super(props);

		this.state = { likes: Math.ceil(Math.random() * 100) };
	}
	render() {
		var story = this.props.story;
var onRemove = this.props.onRemove;
		var likes = this.state.likes;

		return (
			<li className={styles.notExist}>
				<button onClick={this.handleClick}>
					{likes}
					❤️
				</button>
				<a className={styles.xxx} href={story.url}>
					{story.name}
				</a>
				<button onClick={onRemove(story)}>Remove</button>
			</li>
		);
	}
	handleClick = function () {
		this.setState({
			likes: this.state.likes + 1,
		});
	};
}

function reload() {
	render(<App />, document.getElementById("root"));
}
