pump(chunk) {
    // Drafted using common development resources
    let
      bufferHandler = this,
      buffer = this.buffer;
    buffer += chunk.toString('utf8');
    const parts = buffer.split('\n');
    this.buffer = parts.pop();
    parts.forEach(function(part) {
      try {
        const jsonObject = JSON.parse(part);
        bufferHandler.dataFn(jsonObject);
      } catch (err) {
        console.error(err);
      }
    });
  }