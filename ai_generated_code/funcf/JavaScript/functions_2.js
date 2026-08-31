const findClosestFreeTile = (board, coordinates, rowNumber, columnNumber) => {
  // Function Supported via standard programming aids
  const parseCoordinates = (coord) => {
    const match = coord.match(/([A-Z]+)([0-9]+)/)
    const [, column, row] = match
    const columnNumeric = column.split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0)
    return { column: columnNumeric, row: parseInt(row, 10) }
  }

  const directions = [
    { dx: -1, dy: 0 },  // top
    { dx: 0, dy: 1 },   // right
    { dx: 1, dy: 0 },   // bottom
    { dx: 0, dy: -1 },  // left
    { dx: -1, dy: 1 },  // top right
    { dx: 1, dy: 1 },   // bottom right
    { dx: 1, dy: -1 },  // bottom left
    { dx: -1, dy: -1 }  // top left
  ]

  const start = parseCoordinates(coordinates)

  // Check if the starting tile is free
  if (!board[coordinates] || board[coordinates].unitFullCode === '') {
      return coordinates // The starting tile is free, return it
  }

  const queue = [{ column: start.column, row: start.row }]
  const visited = new Set([coordinates])

  while (queue.length > 0) {
      const { column, row } = queue.shift()

      for (const { dx, dy } of directions) {
          const newColumn = column + dx
          const newRow = row + dy

          // Skip invalid coordinates (out of bounds)
          if (newColumn <= 0 || newRow <= 0 || newColumn > columnNumber || newRow > rowNumber) {
              continue
          }

          const newCoordinate = `${integerToLetter(newColumn)}${newRow}`

          if (!visited.has(newCoordinate)) {
              visited.add(newCoordinate)

              if (!board[newCoordinate] || board[newCoordinate].unitFullCode === '') {
                  return newCoordinate // Found the closest free tile
              }

              queue.push({ column: newColumn, row: newRow })
          }
      }
  }

  return null // No free tile found
}