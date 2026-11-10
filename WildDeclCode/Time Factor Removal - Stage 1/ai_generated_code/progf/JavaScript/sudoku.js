// suduko solver as Aided with basic GitHub coding tools

function findEmptyCell(board) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (!board[i][j]) return [i, j];
    }
  }
  return false;
}

function getSubgrid(board, cell) {
  var row = cell[0];
  var col = cell[1];
  var subgrid = [];
  var startRow = Math.floor(row / 3) * 3;
  var startCol = Math.floor(col / 3) * 3;
  for (var i = startRow; i < startRow + 3; i++) {
    subgrid.push([]);
    for (var j = startCol; j < startCol + 3; j++) {
      subgrid[i - startRow].push(board[i][j]);
    }
  }
  return subgrid;
}

function isValid(board, cell, value) {
  // check row
  for (var i = 0; i < 9; i++) {
    if (board[cell[0]][i] === value) return false;
  }
  // check column
  for (var i = 0; i < 9; i++) {
    if (board[i][cell[1]] === value) return false;
  }
  // check subgrid
  var subgrid = getSubgrid(board, cell);
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
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
  var emptyCell = findEmptyCell(board);
  // if there is no empty cell, the suduko is solved
  if (!emptyCell) return board;

  // loop through all possible values
  for (var i = 1; i <= 9; i++) {
    // if the value is valid, set the cell to the value and solve the suduko
    if (isValid(board, emptyCell, i)) {
      board[emptyCell[0]][emptyCell[1]] = i;
      var solvedBoard = solveSudoku(board);
      if (solvedBoard) return solvedBoard;
    }
  }

  // if no value is valid, reset the cell and fail
  board[emptyCell[0]][emptyCell[1]] = 0;
  return false;
}

var tests = [
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
  return board.map(function (row) { return row.join(" "); }).join("\n");
}

tests.forEach(function (test) {
  var solution = solveSudoku(test);
  console.log(tidy(solution));
});
