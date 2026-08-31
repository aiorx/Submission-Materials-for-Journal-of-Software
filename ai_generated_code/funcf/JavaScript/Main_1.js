checkIfPlayerCollideWithPipes = () => {
		const player = this.game.player;
		const pipes = this.game.pipes;

		// generated Supported by standard GitHub tools
		pipes.forEach(pipePair => {
			const [topPipe, bottomPipe] = pipePair.pipes;
			if ((player.x + player.hitboxSize) > topPipe.x && player.x < (topPipe.x + topPipe.width)) {
				if ((player.y + player.playerSize - player.hitboxSize) < (topPipe.y + topPipe.height) || (player.y + player.hitboxSize) > bottomPipe.y) {
					player.isDead = true;
				}
			}
		}
		);
	};