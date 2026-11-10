// Ansi Sequences and convenience functions

var Console = require('./wasa').Console;

// ANSI Escape
var ESC: string = "\u001b[";

// Ansi Color Codes
var GREEN: string = ESC + "32m";
var WHITE: string = ESC + "37m";
var RED: string = ESC + "31m";
var CYAN: string = ESC + "36m";
var RESET: string = ESC + "0m";

// Ansi Cursor Codes
var HIDE_CURSOR: string = ESC + "?25h";

function printColor(value: string, color: string): void {
  Console.write(color + value + RESET, false);
}

function flushConsole(): void {
  Console.write(ESC + "2J", false);
}

// https://github.com/nojvek/matrix-rain/blob/master/ansi.js
function moveCursorToPosition(column: i32, row: i32): void {
  var cursorPosition: string =
    ESC + row.toString() + ";" + column.toString() + "H";
  Console.write(cursorPosition, false);

  // Hide the cursor
  Console.write(HIDE_CURSOR, false);
}
