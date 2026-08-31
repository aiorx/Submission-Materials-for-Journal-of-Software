makeLineByLinesChain(lines) {
    const mergedLines = [];
  
    // Создаем копию массива линий
    const remainingLines = [...lines];
  
    while (remainingLines.length > 0) {
      const chain = [remainingLines[0]];
      remainingLines.shift();
  
      let i = 0;
      while (i < remainingLines.length) {
        const lastLine = chain[chain.length - 1];
        const currentLine = remainingLines[i];
  
        if (this.areCollinear(lastLine, currentLine) && this.haveCommonPoint(lastLine, currentLine)) {
          chain.push(currentLine);
          remainingLines.splice(i, 1);
        } else {
          i++;
        }
      }
  
      if (chain.length > 1) {
        console.log("chain",chain)
        let endPoints = this.findStartEndAtLines([chain[0],chain[chain.length - 1]]);
        console.log(endPoints);
        const mergedLine = new Line({
          point1: endPoints.endPoint,
          point2: endPoints.startPoint
        });
        mergedLines.push(mergedLine);
      } else {
        mergedLines.push(chain[0]);
      }
    }
    console.log("added lines",mergedLines)
    // mergedLines.forEach(e => lines.push(e))
    return mergedLines;
  }