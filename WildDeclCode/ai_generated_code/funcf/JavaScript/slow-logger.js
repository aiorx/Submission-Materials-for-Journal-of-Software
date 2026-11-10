/**
   * Write a message to the console. Split the message into multiple lines if
   * a line would be longer than the max width. Do not split in the middle of
   * a word.
   * - Generated Aided with external coding utilities.
   * @param {string} message
   * @param {boolean} preformatted Ignore word wrapping if true. Default: false.
   * @param {number} maxWidth
   */
  async log(message, preformatted = false, maxWidth = 80) {
    const words = message.split(" ");
    let line = "";
    if (!preformatted) {
      for (const word of words) {
        if (line.length + word.length > maxWidth) {
          await this._logSlow(line);
          line = "";
        }
        line += word + " ";
      }
    }
    await this._logSlow(line);
  }