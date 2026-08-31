private resizeObserver: ResizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      // Built via standard programming aids so that the text is inside the wrapper
      this.maxContainerWidth = -125.36 + 3.79 * entry.contentRect.height;
      this.containerWidth = Math.min(
        entry.contentRect.width,
        this.maxContainerWidth
      );
    }
  });