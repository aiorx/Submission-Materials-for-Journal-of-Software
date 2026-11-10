document.addEventListener('DOMContentLoaded', () => {
    const rollButton = document.getElementById('roll-dice');
    
    function getNamesGui() {
        let gameID = localStorage.getItem('gameSessionID');
        $.ajax({
            url: '/api/game/names',
            method: 'GET',
            dataType: 'json',
            data: { gameSessionID : gameID},
            success: function (response) {
                let gameCategories = {};
                let players = [];
                players = response.playerNames;
                gameCategories = response.categoryNames;
                let i = 1;
                Object.keys(gameCategories).forEach((key)=> {
                    let cName = `.cat${i}`;
                    $(cName).text(gameCategories[key]);
                    $(cName).addClass(key);
            
                    i +=1;

                })

                for (i = 1; i <= players.length; i++) {
                    const token = document.createElement('div');
                    token.id = `player${i}_token`;
                    token.classList.add('player-piece');
                    token.textContent =`${i}`;
                    $('#44').append(token);
                }

                for (let o=1; o<5; o++){
                    let catKey = $(`.catq${o}`).attr('id');
                    $(`.catq${o}`).text(`${gameCategories[catKey]}`)
                }

                $('#current-player').text(`It's currently ${players[0]}'s turn!`);
                let playerBlocks = [12, 16, 52, 56];
                for (let j=0; j<4; j++){
                    $(`#${playerBlocks[j]}`).text(players[j]);
                }              
            },
            error: function (xhr, status, error) {
                alert("Error Get Name: " + error);
            }
        });
    }

    
    function createBoardGui() {
        $('.pop').toggle(); //hide pop up right away
        $('.pop2').toggle();
        $('.pop3').toggle();
        const currentBoard = JSON.parse(localStorage.getItem('gameBoard'));
        $('.moveDir').prop('disabled', true); //turn move buttons off;
        const gameBoard = $('.game-board'); //Grabs HTML element to append the squares.
        
        Object.keys(currentBoard).forEach(key => {
            let currentSquare = currentBoard[key];
            const square = document.createElement('div');
            square.id = String(key);
            square.classList.add(currentSquare['color'], currentSquare['squareType']);
            if (square.classList.contains('HQ')){
                square.textContent = ('HQ');
            }
            else if(square.classList.contains('ROLL_AGAIN')){
                square.textContent = ('Roll Again');
            }
            else if(square.classList.contains('CENTER')){
                square.textContent = ('Trivial Compute');
            }
            
            if (key == 22) {
                square.classList.add("player1_score");
                const div_score_1 = document.createElement('div');
                div_score_1.id = 'score1-1';
                div_score_1.classList.add('scoreDisplay');
                const div_score_2 = document.createElement('div');
                div_score_2.id = 'score1-2';
                div_score_2.classList.add('scoreDisplay');
                const div_score_3 = document.createElement('div');
                div_score_3.id = 'score1-3';
                div_score_3.classList.add('scoreDisplay');
                const div_score_4 = document.createElement('div');
                div_score_4.id = 'score1-4';
                div_score_4.classList.add('scoreDisplay');

                const divs = [div_score_1, div_score_2, div_score_3, div_score_4];
                for (let k = 0; k < divs.length; k++) {
                    square.appendChild(divs[k]);
                }
            }
            else if (key == 26) {
                square.classList.add("player2_score");
                const div_score_1 = document.createElement('div');
                div_score_1.id = 'score2-1';
                div_score_1.classList.add('scoreDisplay');
                const div_score_2 = document.createElement('div');
                div_score_2.id = 'score2-2';
                div_score_2.classList.add('scoreDisplay');
                const div_score_3 = document.createElement('div');
                div_score_3.id = 'score2-3';
                div_score_3.classList.add('scoreDisplay');
                const div_score_4 = document.createElement('div');
                div_score_4.id = 'score2-4';
                div_score_4.classList.add('scoreDisplay');

                const divs = [div_score_1, div_score_2, div_score_3, div_score_4];
                for (let k = 0; k < divs.length; k++) {
                    square.appendChild(divs[k]);
            }
            }
            else if (key == 62) {
                square.classList.add("player3_score");
                const div_score_1 = document.createElement('div');
                div_score_1.id = 'score3-1';
                div_score_1.classList.add('scoreDisplay');
                const div_score_2 = document.createElement('div');
                div_score_2.id = 'score3-2';
                div_score_2.classList.add('scoreDisplay');
                const div_score_3 = document.createElement('div');
                div_score_3.id = 'score3-3';
                div_score_3.classList.add('scoreDisplay');
                const div_score_4 = document.createElement('div');
                div_score_4.id = 'score3-4';
                div_score_4.classList.add('scoreDisplay');

                const divs = [div_score_1, div_score_2, div_score_3, div_score_4];
                for (let k = 0; k < divs.length; k++) {
                    square.appendChild(divs[k]);
            }
            }
            else if (key == 66) {
                square.classList.add("player4_score");
                const div_score_1 = document.createElement('div');
                div_score_1.id = 'score4-1';
                div_score_1.classList.add('scoreDisplay');
                const div_score_2 = document.createElement('div');
                div_score_2.id = 'score4-2';
                div_score_2.classList.add('scoreDisplay');
                const div_score_3 = document.createElement('div');
                div_score_3.id = 'score4-3';
                div_score_3.classList.add('scoreDisplay');
                const div_score_4 = document.createElement('div');
                div_score_4.id = 'score4-4';
                div_score_4.classList.add('scoreDisplay');

                const divs = [div_score_1, div_score_2, div_score_3, div_score_4];
                for (let k = 0; k < divs.length; k++) {
                    square.appendChild(divs[k]);
            }
            }
            // console.log(square.outerHTML);

            gameBoard.append(square);
        })

    }


    rollButton.addEventListener('click', () => {
        let gameID = localStorage.getItem('gameSessionID');
        // console.log(gameID);
        $.ajax({
            url: '/api/game/rollDie',
            method: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ gameSessionID : gameID}),
            success: function (response) {
                requestAnimationFrame((timestamp)=>animateRoll(timestamp, response.roll));
                updateDirectionButtonsGui(response.availableDirections);
                $('#roll-dice').prop('disabled', true);

            },
            error: function (xhr, status, error) {
                alert("Error Roll Die: " + error);
            }
        });
        
    });
 
    function updateDirectionButtonsGui(availableDirections){
        let fixed_directions = ["LEFT", "RIGHT", "UP", "DOWN"];
        fixed_directions.forEach(direction => {

            let currentButton = document.getElementById(direction);
            if (availableDirections.includes(direction)){
                currentButton.disabled = false;
            }
            else {
                currentButton.disabled = true;
            }
        });
    }

    $('.moveDir').click(function() {
        let direction = $(this).attr("id");
        // console.log(direction);
        sendMovement(direction);

    })


    $('#reveal').click(function() {
        
        // Log the value to the console
        let gameID = localStorage.getItem('gameSessionID');
        $('.revealButton').toggle();
        $('.correctButton').toggle();
        $('.incorrectButton').toggle();

        $.ajax({
            url: '/api/game/showAnswer',
            method: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ gameSessionID : gameID}),
            success: function (response) {
                $('.realAnswer').text(response.correctAnswer);
                $('.realAnswer').fadeToggle(300);
                $('.compareAnswer').text("Correct Answer:");
                $('.compareAnswer').fadeToggle(300);
            },
            error: function (xhr, status, error) {
                alert("Error Evaluate Answer: " + error);
            }
        });

    })

    /**
     * format an object for readability. Formed using common development resources
     * @param {*} obj 
     * @param {*} indent 
     * @returns 
     */
    function formatObject(obj, indent = 0) {
        const indentation = ' '.repeat(indent);
        return Object.entries(obj).map(([key, value]) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return `${indentation}${key}:\n${formatObject(value, indent + 2)}`;
            } else {
                return `${indentation}${key}: ${Array.isArray(value) ? value.join(', ') : value}`;
            }
        }).join('\n');
    }

    $('.judge').click(function() {
        // $('.realAnswer').toggle();
        // $('.compareAnswer').toggle();
        // $('.compareAnswer').text("");
        $('.pop').fadeToggle(); 
        $('#roll-dice').prop('disabled', false);
        $('.revealButton').toggle();
        // Log the value to the console
        let gameID = localStorage.getItem('gameSessionID');
        let id = $(this).attr("id");
        const isCorrect = id === "correct";

        $.ajax({
            url: '/api/game/judgeAnswer',
            method: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ gameSessionID : gameID, isCorrect: isCorrect}),
            success: function (response) {
                $('#current-player').text(`It's currently ${response.nextPlayerName}'s turn!`);
                // console.log(response.nextPlayerName);
                // console.log(response);
                if (response.scoreboardToUpdate != null) {
                    let playerScoreIndex = response.scoreboardToUpdate + 1;
                    updateScore(playerScoreIndex, response.score);
                }
                if (response.endGameData != null) {

                    let winnerName = response.endGameData.winner;
                    $('#gameWinner').text(winnerName + " is the winner!");

                    let stats = response.endGameData.stats;

                    $('#gameStats').text(
                        `Statistics:\n${formatObject(stats)}`
                        // `Questions Correctly Answered:  ${stats.timesAsked}/${stats.timesCorrectlyAnswered} (${(stats.timesAsked/stats.timesCorrectlyAnswered).toFixed(2)}) \n`
                    )

                    $(".pop3").fadeToggle(200);
                }
            },
            error: function (xhr, status, error) {
                alert("Error Evaluate Answer: " + error);
            }
        });

    })


    function updateScore(index, score){
        if (score.RED){
            $(`#score${index}-1`).addClass("scoreRed");
        }
        if (score.YELLOW){
            $(`#score${index}-2`).addClass("scoreYellow");
        }
        if (score.GREEN){
            $(`#score${index}-3`).addClass("scoreGreen");
        }
        if (score.BLUE){
            $(`#score${index}-4`).addClass("scoreBlue");
        }
    }



    // "RED": true,
    // "BLUE": false,
    // "GREEN": false,
    // "YELLOW": true


    function sendMovement(directionClick) {
        let gameID = localStorage.getItem('gameSessionID');
        // console.log("Game ID:", gameID);
        // console.log("Direction Clicked:", directionClick);
    
        $.ajax({
            url: '/api/game/pickDirection',
            method: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ gameSessionID: gameID, direction: directionClick }),
            success: function (response) {
                if (response.squareType === "ROLL_AGAIN") {
                    // console.log("Rolling again.");
                    $('#current-player').text(`Let's Go Gambling! Roll Again`);
                    $('#roll-dice').prop('disabled', false);
                    clearDie();
                } else if (response.squareType === "NORMAL" || response.squareType === "HQ") {
                    // console.log(response.question.questionTitle);
    
                    const typeOfQuestion = response.question.typeOfQuestion;
                    const fileLocation = response.question.fileLocation;
                    
                    // Clear any existing media elements
                    // $('.questionDisplay').nextAll('audio, img, video').remove();
                    $('.questionDisplay').siblings('audio, img, video').remove()
    
                    function showMedia(element) {
                        $('.questionDisplay').after(element);
                        element.style.display = 'block';
                        element.style.maxWidth = '100%';
                        element.style.margin = '10px auto';
                        element.style.gridColumn = '1/3'; // Match the grid-column of `.questionDisplay`
                        element.style.gridRow = '3/4'; // Place it in the next grid row
                    }
    
                    // Function to fetch media URL from the new API
                    function fetchMediaUrl(fileLocation) {
                        return $.ajax({
                            url: '/api/fetchMediaContent',
                            method: 'GET',
                            xhrFields: {
                                responseType: 'blob'
                            },
                            data: { filePath: fileLocation },
                        });
                    }
                   
                    switch (typeOfQuestion) {
                        case "FREE_TEXT":
                            // No additional media to display for free text questions
                            $('.questionDisplay').text(response.question.questionTitle);
                            break;
                        case "AUDIO":
                            $('.questionDisplay').text(response.question.questionTitle);
                            fetchMediaUrl(fileLocation).then(blob => {
                                const audioElement = document.createElement('audio');
                                audioElement.src = URL.createObjectURL(blob);
                                audioElement.controls = true;
                                audioElement.oncanplaythrough = () => showMedia(audioElement);
                                audioElement.onerror = () => console.error("Error loading audio:", fileLocation);
                            }).catch(error => {
                                console.error("Error fetching audio:", error);
                            });
                            break;
                        case "IMAGE":
                            $('.questionDisplay').text(response.question.questionTitle);
                            fetchMediaUrl(fileLocation).then(blob => {
                                const imageElement = document.createElement('img');
                                imageElement.src = URL.createObjectURL(blob);
                                imageElement.alt = "Question Image";
                                imageElement.onload = () => showMedia(imageElement);
                                imageElement.onerror = () => console.error("Error loading image:", fileLocation);
                            }).catch(error => {
                                console.error("Error fetching image:", error);
                            });
                            break;
                        case "VIDEO":
                            $('.questionDisplay').text(response.question.questionTitle);
                            fetchMediaUrl(fileLocation).then(blob =>  {
                                const videoElement = document.createElement('video');
                                videoElement.src = URL.createObjectURL(blob);
                                videoElement.controls = true;
                                videoElement.oncanplaythrough = () => showMedia(videoElement);
                                videoElement.onerror = () => console.error("Error loading video:", fileLocation);
                            }).catch(error => {
                                console.error("Error fetching video:", error);
                            });
                            break;
                        default:
                            console.warn(`Unknown question type: ${typeOfQuestion}`);
                            break;
                    }
    
                    $('.pop').fadeToggle(300);
                    $('.realAnswer').toggle();
                    $('.compareAnswer').toggle();
                    $('.correctButton').toggle();
                    $('.incorrectButton').toggle();
    
                } else if (response.squareType === "CENTER") {
                    $('.pop2').fadeToggle(300);
                }
    
                updateDirectionButtonsGui(response.availableDirections);
                movePlayerToken(response.currentPlayerIndex, response.path.at(-1));
            },
            error: function (xhr, status, error) {
                alert("Error: " + error);
            }
        });
    }


    function movePlayerToken(playerIndex, destination) {
        let token = $(`#player${playerIndex+1}_token`);
        // console.log(token);
        $(`#player${playerIndex+1}_token`).remove();
        $(`#${destination}`).append(token);
    }



    $('#end-turn').click(function() {
        $('#end-turn').toggle();
        $('#roll-dice').toggle();
        clearDie();
    });

    $("#return-button").click(function() {
        let consent = confirm("Return to Home?");
        if (consent) {
            window.location.href = 'gameConfig.html'
        }
        else {
            console.log("Somebody tried to quit");
        }
        // Add functionality to return to the previous page
    })

    $("#return-button2").click(function() {
        let consent = confirm("Return to Home?");
        if (consent) {
            window.location.href = 'gameConfig.html'
        }
        else {
            console.log("Somebody tried to quit");
        }
        // Add functionality to return to the previous page
    })


    $('.textq').click(function() {
        let colorDirection = $(this).attr("id");
        $('.pop2').toggle();
        getCategoryQuestion(colorDirection);

    })

    function getCategoryQuestion(colorID) {
        let gameID = localStorage.getItem('gameSessionID');
        $.ajax({
            url: '/api/game/selectCategory',
            method: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ gameSessionID : gameID, color: colorID}),
            success: function (response) {

                // TODO: Add displays for audio, image, and video (fill out the switch statement cases)
                const typeOfQuestion = response.typeOfQuestion;
                const fileLocation = response.fileLocation;
                // console.log(response);
                // Clear any existing media elements
                // Clear any existing media elements
                // $('.questionDisplay').nextAll('audio, img, video').remove();
                $('.questionDisplay').siblings('audio, img, video').remove()
    
                function showMedia(element) {
                    $('.questionDisplay').after(element);
                    element.style.display = 'block';
                    element.style.maxWidth = '100%';
                    element.style.margin = '10px auto';
                    element.style.gridColumn = '1/3'; // Match the grid-column of `.questionDisplay`
                    element.style.gridRow = '3/4'; // Place it in the next grid row
                }

                // Function to fetch media URL from the new API
                function fetchMediaUrl(fileLocation) {
                    return $.ajax({
                        url: '/api/fetchMediaContent',
                        method: 'GET',
                        xhrFields: {
                            responseType: 'blob'
                        },
                        data: { filePath: fileLocation },
                    });
                }
               
                switch (typeOfQuestion) {
                    case "FREE_TEXT":
                        // No additional media to display for free text questions
                        $('.questionDisplay').text(response.questionTitle);
                        break;
                    case "AUDIO":
                        $('.questionDisplay').text(response.questionTitle);
                        fetchMediaUrl(fileLocation).then(blob => {
                            const audioElement = document.createElement('audio');
                            audioElement.src = URL.createObjectURL(blob);
                            audioElement.controls = true;
                            audioElement.oncanplaythrough = () => showMedia(audioElement);
                            audioElement.onerror = () => console.error("Error loading audio:", fileLocation);
                        }).catch(error => {
                            console.error("Error fetching audio:", error);
                        });
                        break;
                    case "IMAGE":
                        $('.questionDisplay').text(response.questionTitle);
                        fetchMediaUrl(fileLocation).then(blob => {
                            const imageElement = document.createElement('img');
                            imageElement.src = URL.createObjectURL(blob);
                            imageElement.alt = "Question Image";
                            imageElement.onload = () => showMedia(imageElement);
                            imageElement.onerror = () => console.error("Error loading image:", fileLocation);
                        }).catch(error => {
                            console.error("Error fetching image:", error);
                        });
                        break;
                    case "VIDEO":
                        $('.questionDisplay').text(response.questionTitle);
                        fetchMediaUrl(fileLocation).then(blob =>  {
                            const videoElement = document.createElement('video');
                            videoElement.src = URL.createObjectURL(blob);
                            videoElement.controls = true;
                            videoElement.oncanplaythrough = () => showMedia(videoElement);
                            videoElement.onerror = () => console.error("Error loading video:", fileLocation);
                        }).catch(error => {
                            console.error("Error fetching video:", error);
                        });
                        break;
                    default:
                        console.warn(`Unknown question type: ${typeOfQuestion}`);
                        break;
                }


                $('.questionDisplay').text(response.questionTitle);
                $('.pop').toggle();
                $('.realAnswer').toggle();
                $('.compareAnswer').toggle();
                $('.correctButton').toggle();
                $('.incorrectButton').toggle();
            },
            error: function (xhr, status, error) {
                alert("Error Select Category: " + error);
            }
        });
    }

    createBoardGui();
    getNamesGui();

});



const animationDelay = 150;
let elapsedDrawTime = 0;
let lastDrawTime = 0;
let frameIndex = 0;


// Dice animation 
let diceImage = new Image();
let diceRolling = new Image();
diceImage.src = "./assets/dice.png"; //Dice image relative to html.
diceRolling.src = "./assets/diceAnimation.png";
board = document.getElementById('dice');
board.height = 60;
board.width = 60;
let context = board.getContext("2d");
context.fillStyle ='black';
context.clearRect(0, 0, 60, 60);


let xFrames = [37, 37, 451, 451, 37, 37, 451, 451];
let yFrames = [15, 221, 15, 221, 15, 221, 15, 221];
let xFrame = [32, 509, 996, 32, 509, 996];
let yFrame = [29, 29, 29, 579, 579, 579];

function clearDie(){
    context.clearRect(0, 0, 60, 60);
    context.drawImage(diceRolling, xFrames[frameIndex], yFrames[frameIndex], 180, 180, 2, 2, 60, 60 );
}
diceRolling.onload = function() {
    context.drawImage(diceRolling, xFrames[frameIndex], yFrames[frameIndex], 180, 180, 2, 2, 60, 60 );
};

function animateRoll(timestamp, roll) {
    if (!lastDrawTime) {
        lastDrawTime = timestamp;
    }
    elapsedDrawTime = timestamp - lastDrawTime;
    if (elapsedDrawTime > animationDelay) {
        lastDrawTime = timestamp;
        context.clearRect(0, 0, 60, 60);
        context.drawImage(diceRolling, xFrames[frameIndex], yFrames[frameIndex], 180, 180, 2, 2, 60, 60 );
        frameIndex += 1;
    }

    if (frameIndex < 8) {
        requestAnimationFrame((timestamp)=>animateRoll(timestamp, roll));
    }
    else {
        frameIndex = 0;
        context.clearRect(0, 0, 60, 60);
        context.drawImage(diceImage, xFrame[roll-1], yFrame[roll-1], 430, 422, 0, 0, 60, 60 );
       
    }
}