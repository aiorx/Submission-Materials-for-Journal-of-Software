const squares = document.getElementsByClassName('square');
const message = document.getElementById('message');
const startMsg = document.getElementsByClassName('tttstartmsg')[0];
const resetBtn = document.getElementById('ttt-resetBtn');
const playerSymbol = 'x';
const computerSymbol = 'o';
const waysToWin = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const playerScoreDisplay = document.getElementById('playerscore');
const computerScoreDisplay = document.getElementById('compscore');
let playerScore = 0;
let computerScore = 0;


// reset game 
resetBtn.addEventListener('click', function () {
  location.reload();
});

/* handleClick function here and in all other places mentioned on the page is code 
Aided using common development resources the codes function is to remove the eventListeners of the squares[i] after a result is declared */

function handleClick(event) {
  /* mainloop starting of when site visitor clicks a square after that event all the other 
  functions will be called systematically */
  if (event.target.getAttribute('data-symbol') === '') {
    event.target.src = 'assets/images/x.png';
    startMsg.style.display = 'none';
    event.target.setAttribute('data-symbol', playerSymbol);
    if(!resultDetector()) {
      getCompPick();
      resultDetector();
    }
    gameOver();
    scoreKeeper();
  }
}

// gameOver function if 
function gameOver() {
  if (message.innerHTML === 'You Win!' || message.innerHTML === 'You Lost!' || message.innerHTML === 'Draw!') {
    for (let i = 0; i < squares.length; i++) {
      squares[i].removeEventListener('click', handleClick);
    }
    round();
  }
}

for (let i = 0; i < squares.length; i++) {
  squares[i].addEventListener('click', handleClick);
}

// Generating a computer pick by filtering out the picked squares and then getting a randomized pick of available ones
function getCompPick() {
  const unPickedSquare = Array.from(squares).filter(square => square.getAttribute('data-symbol') === '');

  if(unPickedSquare.length > 0) {
    const randomNumber = Math.floor(Math.random() * unPickedSquare.length);
    unPickedSquare[randomNumber].setAttribute('src', 'assets/images/o.png');
    unPickedSquare[randomNumber].setAttribute('data-symbol', computerSymbol);
  }
}

// The code in this function has been generated from chatGPT
function resultDetector() {
  let winner = null;
  for (let i = 0; i < waysToWin.length; i++) {
    const [a, b, c] = waysToWin[i];
    if(squares[a].getAttribute('data-symbol') !== '' &&
      squares[a].getAttribute('data-symbol') === squares[b].getAttribute('data-symbol') &&
      squares[a].getAttribute('data-symbol') === squares[c].getAttribute('data-symbol')) {
      winner = squares[a].getAttribute('data-symbol');
      break;
    }
  }

  if (winner === playerSymbol) {
    (message.innerHTML = 'You Win!');
    return true;
  } else if (winner === computerSymbol) {
    (message.innerHTML = 'You Lost!');
    return true;
  } else if (Array.from(squares).every(square => square.getAttribute('data-symbol') !== '')) {
    (message.innerHTML = 'Draw!');
    return true;
  }
};

// Score keeper
function scoreKeeper() {
  if(message.innerHTML === 'You Win!') {
    playerScore++;
    playerScoreDisplay.innerHTML = playerScore;
  }
  if(message.innerHTML === 'You Lost!') {
    computerScore++;
    computerScoreDisplay.innerHTML = computerScore;
  }
}

// round function resets the squares 2 seconds after outcome has been declared while not reseting the score
function round() {
  if (resultDetector()) {
    setTimeout(() => {
      for (let i = 0; i < squares.length; i++) {
        squares[i].src = 'assets/images/sqr.png';
        squares[i].setAttribute('data-symbol', '');
      }

      for (let i = 0; i < squares.length; i++) {
        squares[i].addEventListener('click', handleClick);
      }

      message.innerHTML = '';
    }, 2000);
  }
}
