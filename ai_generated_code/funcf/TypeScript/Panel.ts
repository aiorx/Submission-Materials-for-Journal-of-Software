override render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.#color;
    ctx.strokeStyle = this.#borderOptions.color;
    ctx.lineWidth = this.#borderOptions.width;
    ctx.beginPath();
    ctx.moveTo(
      this.globalPosition.x + this.#borderOptions.radius,
      this.globalPosition.y
    );
    ctx.lineTo(
      this.globalPosition.x + this.#width - this.#borderOptions.radius,
      this.globalPosition.y
    );
    ctx.quadraticCurveTo(
      this.globalPosition.x + this.#width,
      this.globalPosition.y,
      this.globalPosition.x + this.#width,
      this.globalPosition.y + this.#borderOptions.radius
    );
    ctx.lineTo(
      this.globalPosition.x + this.#width,
      this.globalPosition.y + this.#height - this.#borderOptions.radius
    );
    ctx.quadraticCurveTo(
      this.globalPosition.x + this.#width,
      this.globalPosition.y + this.#height,
      this.globalPosition.x + this.#width - this.#borderOptions.radius,
      this.globalPosition.y + this.#height
    );
    ctx.lineTo(
      this.globalPosition.x + this.#borderOptions.radius,
      this.globalPosition.y + this.#height
    );
    ctx.quadraticCurveTo(
      this.globalPosition.x,
      this.globalPosition.y + this.#height,
      this.globalPosition.x,
      this.globalPosition.y + this.#height - this.#borderOptions.radius
    );
    ctx.lineTo(
      this.globalPosition.x,
      this.globalPosition.y + this.#borderOptions.radius
    );
    ctx.quadraticCurveTo(
      this.globalPosition.x,
      this.globalPosition.y,
      this.globalPosition.x + this.#borderOptions.radius,
      this.globalPosition.y
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }