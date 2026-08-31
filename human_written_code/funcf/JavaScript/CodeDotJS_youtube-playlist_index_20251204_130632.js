```js
const splitCurrentPlay = str => {
	return str.indexOf('watch') === -1 ? `${str}&disable_polymer=1` : `https://www.youtube.com/playlist?list=${str.split('&list=')[1].split('&t=')[0]}&disable_polymer=1`;
};
```