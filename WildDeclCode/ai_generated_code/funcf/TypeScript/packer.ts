```typescript
private bestFitAlgorithm() {
    const rows: { remainingWidth: number; y: number; maxHeight: number }[] = []

    for (const block of this.blocks) {
        // Find the best row that can fit this block
        let bestRow = null
        let minRemainingWidth = this.layoutWidth + 1

        for (const row of rows) {
            if (row.remainingWidth >= block.width && row.remainingWidth - block.width < minRemainingWidth) {
                bestRow = row
                minRemainingWidth = row.remainingWidth - block.width
            }
        }

        if (bestRow === null) {
            // No suitable row found, create a new one
            const newRowY = rows.length > 0 ? rows[rows.length - 1].y + rows[rows.length - 1].maxHeight : 0
            
            if (newRowY + block.height > this.layoutHeight) {
                // If the block doesn't fit on the canvas, resize if autoResize is enabled
                if (this.autoResize === "height") {
                    this.layoutHeight = newRowY + block.height
                } else {
                    // No resizing allowed and no space left, stop placing more blocks
                    break
                }
            }

            bestRow = {
                remainingWidth: this.layoutWidth - block.width,
                y: newRowY,
                maxHeight: block.height,
            }
            rows.push(bestRow)
        } else {
            // Update the row to account for the placed block
            bestRow.remainingWidth -= block.width
            bestRow.maxHeight = Math.max(bestRow.maxHeight, block.height)
        }

        // Place the block in the best row
        this.output.push({
            x: this.layoutWidth - bestRow.remainingWidth - block.width,
            y: bestRow.y,
            width: block.width,
            height: block.height,
            id: block.id,
        })
    }
}
```
```typescript
private nextFitAlgorithm() {
    let currentX = 0
    let currentY = 0
    let maxHeightInRow = 0

    for (const block of this.blocks) {
        if (currentX + block.width > this.layoutWidth) {
            // Start a new row if the current block doesn't fit in the current row
            currentX = 0
            currentY += maxHeightInRow
            maxHeightInRow = 0
        }

        if (currentY + block.height > this.layoutHeight) {
            // If the block doesn't fit on the canvas, resize if autoResize is enabled
            if (this.autoResize === "height") {
                this.layoutHeight = currentY + block.height
            } else {
                // No resizing allowed and no space left, stop placing more blocks
                break
            }
        }

        this.output.push({
            x: currentX,
            y: currentY,
            width: block.width,
            height: block.height,
            id: block.id,
        })

        currentX += block.width
        maxHeightInRow = Math.max(maxHeightInRow, block.height)
    }
}
```