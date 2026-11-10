// suduko solver as Aided with basic GitHub coding tools

function findEmptyCell(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!board[i][j]) return [i, j];
    }
  }
  return false;
}

function getSubgrid(board, cell) {
  let row = cell[0];
  let col = cell[1];
  let subgrid = [];
  let startRow = Math.floor(row / 3) * 3;
  let startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    subgrid.push([]);
    for (let j = startCol; j < startCol + 3; j++) {
      subgrid[i - startRow].push(board[i][j]);
    }
  }
  return subgrid;
}

function isValid(board, cell, value) {
  // check row
  for (let i = 0; i < 9; i++) {
    if (board[cell[0]][i] === value) return false;
  }
  // check column
  for (let i = 0; i < 9; i++) {
    if (board[i][cell[1]] === value) return false;
  }
  // check subgrid
  let subgrid = getSubgrid(board, cell);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (subgrid[i][j] === value) return false;
    }
  }
  return true;
}

// solves the given suduko puzzle
// @param {array} board - the 9x9 suduko puzzle
// @return {array} - the solved suduko puzzle
function solveSudoku(board) {
  // find the first empty cell
  const emptyCell = findEmptyCell(board);
  // if there is no empty cell, the suduko is solved
  if (!emptyCell) return board;

  // loop through all possible values
  for (let i = 1; i <= 9; i++) {
    // if the value is valid, set the cell to the value and solve the suduko
    if (isValid(board, emptyCell, i)) {
      board[emptyCell[0]][emptyCell[1]] = i;
      const solvedBoard = solveSudoku(board);
      if (solvedBoard) return solvedBoard;
    }
  }

  // if no value is valid, reset the cell and fail
  board[emptyCell[0]][emptyCell[1]] = 0;
  return false;
}

const tests = [
  [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ],
];

function tidy(board) {
  return board.map((row) => row.join(" ")).join("\n");
}

tests.forEach((test) => {
  const solution = solveSudoku(test);
  console.log(tidy(solution));
});
