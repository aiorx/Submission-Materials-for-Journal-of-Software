```js
const play = async song => {
	const queue = message.client.queue.get(message.guild.id);
	if (!song) {
		queue.voiceChannel.leave();
		message.client.queue.delete(message.guild.id);
		return;
	}

	const dispatcher = queue.connection.play(ytdl(song.url))
		.on('finish', () => {
			queue.songs.shift();
			play(queue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(queue.volume / 5);
	queue.textChannel.send(`🎶 Start playing: **${song.title}**`);
};
```