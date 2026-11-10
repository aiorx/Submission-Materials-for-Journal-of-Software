// Basic Game 
// Generate AI HTML, CSS and JS code for Rock Paper Scissors game 🍏 
// Paste into the correct files 🍏 
// Does the game work? 🍏 
    // - HTML and CSS linked to show a themed static page, JS functions 🍏 

// This is the code Assisted with basic coding tools in response to request - 
// please may I have the javascript for the HTML above?

// TASK - COMMENT ONE THE CODE
/* Now spend time reading through the code line by line, and write your own comments after each line to help break down and explain what each line is doing. 
// Reading and understanding existing code is a key skill for developers, so take your time to fully understand how it works. 
//If there's something you don't recognize or understand, you can ask ChatGPT to explain that part specifically, or you can Google.

  - Identify the JavaScript fundamentals we've covered in the course so far. How is the code using variables, arrays, objects, functions, etc.?
  - Identify how the code interacts with and manipulates the DOM. How does it use the methods we've learned already? Are there any methods it uses that we didn't cover in class? If so, Google them!
  - Is there anything you would change about the code generated?
  - Is there any bit hard to read that you would rewrite to be clearer?
  - Is there any functionality you'd like to add?
  - Would you style it differently? */

 
const rock = document.getElementById("rock");
// declared variable rock to access the HTML element with the ID "rock" (<button>element</button>) and store a reference to it in the variable rock.  
const paper = document.getElementById("paper");
// declared variable paper to access the HTML element with the ID "paper" (<button>element</button>) and store a reference to it in the variable rock.
const scissors = document.getElementById("scissors");
// declared variable scissors to access the HTML element with the ID "scissors" (<button>element</button>) and store a reference to it in the variable rock.
// nb. the three lines of code above allow you to interact with the specified HTML element using JavaScript.


const playerChoiceText = document.getElementById("player-choice-text");
// declared variable playerChoiceText to access the HTML element with the ID "player-choice-text" (<p>element</p>) and store a reference to it in the variable playerChoiceText.
const computerChoiceText = document.getElementById("computer-choice-text");
// declared variable computerChoiceText to access the HTML element with the ID "computer-choice-text" (<p>element</p>) and store a reference to it in the variable computerChoiceText.
const outcomeText = document.getElementById("outcome-text");
// declared variable outcomeText to access the HTML element with the ID "outcome-text" (<p>element</p>) and store a reference to it in the variable outcomeText.

const playerScoreText = document.getElementById("player-score-text");
// declared variable playerScoreText to access the HTML element with the ID "player-score-text" (<p>element</p>) and store a reference to it in the variable playerScoreText.
const computerScoreText = document.getElementById("computer-score-text");
// declared variable computerScoreText to access the HTML element with the ID "computer-score-text" (<p>element</p>) and store a reference to it in the variable playerChoiceText.


let playerScore = 0;
// declared variable playerScore and assigned it a a value of 0.
let computerScore = 0;
// declared variable computerScore and assigned it a value of 0.
// the xxxScore variables are used to store and track the players' scores during the game.


function computerPlay() {
    const choices = ["Rock", "Paper", "Scissors"];
    return choices[Math.floor(Math.random() * choices.length)];
}
//////// declared function computerPlay() 
// created array named choices containing the three options of rock, paper, and scissors
// Math.random() generates a random decimal number between 0 and 1
// the random number that has been generated is multiplied by the length or the choices array (this is 3)
// the result is a decimal number between 0 (inclusive) and 3 (exclusive)
// Math.floor() rounds down decimals to nearest whole number which will be an integer between 0 and 2 (inclusive)
// the integer that has been computed is used as an index to access an element from the choices array 
// it will randomly select one of the three options
// the selected choice is returned as the output of the function

// nb. when the computerPlay function is called, it returns a random choice for the computer to play in the game. 
// This choice is later used in the game logic to determine the outcome of each round.

// --------------------


function playRound(playerSelection, computerSelection) {
    if (playerSelection === computerSelection) {
        return "Draw";
    } else if (
        (playerSelection === "Rock" && computerSelection === "Scissors") ||
        (playerSelection === "Paper" && computerSelection === "Rock") ||
        (playerSelection === "Scissors" && computerSelection === "Paper")
    ) {
        return "Player";
    } else {
        return "Computer";
    }
}

//////// declared function playRound()
// the playRound function takes two parameters (playerSelection and computerSelection)
// and if / else if statement is created 
// --> if parameter input for playerSelection is strictly equal to parameter input for computerSelection 
// --> return "Draw" 
// --> else if parameter input for playerSelection is Rock and parameter input for computerSelection is Scissors
// --> or 
// --> if parameter input for playerSelection is Paper and parameter input for computerSelection is Rock 
// --> or 
// --> if parameter input for playerSelection is Scissors and parameter input for computerSelection is Paper 
// --> return "Player"
// --> else 
// --> return "Computer"

// --------------------

function updateScoreboard() {
    playerScoreText.textContent = playerScore;
    computerScoreText.textContent = computerScore;
}

//////// declared function updateScoreboard()




// --------------------


function handleClick(choice) {
    const computerChoice = computerPlay();
    const result = playRound(choice, computerChoice);

    playerChoiceText.textContent = choice;
    computerChoiceText.textContent = computerChoice;

    if (result === "Draw") {
        outcomeText.textContent = "It's a draw!";
    } else if (result === "Player") {
        outcomeText.textContent = "You win!";
        playerScore++;
    } else {
        outcomeText.textContent = "Computer wins!";
        computerScore++;
    }

    updateScoreboard();
}

//////// declared function handleClick()




// --------------------

rock.addEventListener("click", () => handleClick("Rock"));
paper.addEventListener("click", () => handleClick("Paper"));
scissors.addEventListener("click", () => handleClick("Scissors"));





