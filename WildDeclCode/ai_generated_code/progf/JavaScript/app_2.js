/*----- constants -----*/
const MAP_LEVEL_ONE = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 0, 1, 0, 6, 0, 1, 6, 1, 0, 1, 6, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 0, 1, 1, 0, 6, 1, 0, 1, 6, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 6, 1, 6, 1, 0, 0, 6, 0, 0, 1, 6, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const PLAYER_START = {
    fuelCells: 3,
    creaturesFound: 0,
    mazePosition: [1, 0],
    level: 1,
    hasWeapon: false
}

// Sets the player object as a copy of the PLAYER_START object
let player = {
    ...PLAYER_START,
    mazePosition: [...PLAYER_START.mazePosition]
}; 
  

const GRID_CLASSES = ['path', 'wall', 'player', 'enemy', 'encounter', 'creature', 'unknown', 'fog']

const SPECIES_NAMES = ['Fluxorgon', 'Blipblorp', 'Cuddlexian', 'Quizzlit', 'Pluffigon', 'Wobblex', 'Zibzorb', 'Nuzzletron', 'Grizzlebee', 'Fluffinate', 'Glimblatt', 'Squizzelar', 'Mubbleflop', 'Zoopzop', 'Jibberjell', 'Wigglimon', 'Cluzzleclank', 'Blibberfudge', 'Fuzzlequark', 'Zumblezot', 'Plopplip', 'Quibquab', 'Buzzleboon', 'Dribbledorf', 'Flibblestix'];

const SPECIES_IMAGES = ['./imgs/species_1.png', './imgs/species_2.png', './imgs/species_3.png', './imgs/species_5.png', './imgs/species_4.png', './imgs/species_6.png']

const SPECIES_CONGRATS_TEXT = [`So cute!`, `OMG adorable!`, `Heart-meltingly sweet!`, `Too cute to handle!`, `Aww, precious!`, `What a cutie pie!`, `Absolutely charming!`, `Irresistibly cute!`, `Look at those eyes!`, `Overloaded with cuteness!`, `Squee-worthy!`, `That's just darling!`, `Cuteness level: 1000!`, `So fluffy and cute!`, `Melted my heart!`, `Could it get any cuter?`, `That's some next-level cuteness!`, `A bundle of joy!`, `Pure adorableness!`, `Such a sweetie!`, `Cuteness overload!`, `I'm in love!`, `Too sweet to be real!`, `A true cutie!`, `Gushing over this cuteness!`];

const RESTART_DELAY = 10000;

const ENEMY_PATHS = [
    [{y:5, x:5}, {y:5, x:4}, {y:5, x:3}, {y:5, x:2}, {y:5, x:1}, {y:5, x:2}, {y:5, x:3}, {y:5, x:4}, {y:5, x:5}],
    [{y:7, x:9}, {y:6, x:9}, {y:5, x:9}, {y:4, x:9}, {y:3, x:9}, {y:2, x:9}, {y:1, x:9}, {y:2, x:9}, {y:3, x:9}, {y:4, x:9}, {y:5, x:9}, {y:6, x:9}, {y:7, x:9}],
    [{y:1, x:13},{y:2, x:13}, {y:3, x:13}, {y:4, x:13}, {y:5, x:13}, {y:6, x:13}, {y:7, x:13}, {y:6, x:13}, {y:5, x:13}, {y:4, x:13}, {y:3, x:13}, {y:2, x:13}, {y:1, x:13}],
];

const STORYLINE = `
    It's the year 2241, and humanity is... bored. <br><br>

    You're just launching your career as an space wildlife photographer, and you have a plan: find the 
    cutest creatures in the galaxy and share them with the world. Find <b>4</b> to win! <br><br>

    <b>But beware:</b> space is lawless, and if you aren't careful, your precious fuel cells will be stolen!
`;

const ENCOUNTER_DESCRIPTIONS = {
    encounter1: {
        trigger: {
            title: `Mysterious Signal Echoes!`,
            image: `./imgs/encounter_1.png`,
            text: `Amid the silent void, your ship's radar detects a faint distress signal, pulsating from a distant derelict ship. The eerie silence is broken only by this beacon. Do you dare approach?`,
            option1: `Venture forth and investigate`,
            option2: `Steer clear; it could be a ruse`,
            sound: 'alertSound'
        },
        resolution1: {
            title: `A Grateful Traveler!`,
            image: `./imgs/encounter_1_resolution_1.png`,
            text: `Navigating through the wreckage, you discover a stranded traveler. His ship was attacked by space pirates, and he's been floating aimlessly ever since. Grateful for the timely rescue, he gifts you a fuel cell, a relic from his now-defunct ship.`,
            outcome: 'gain1',
            sound: 'goodSound'
        },
        resolution2: {
            title: `Cosmic Deception!`,
            image: `./imgs/encounter_1_resolution_2.png`,
            text: `As you steer clear of the signal, you notice rogue spacecrafts lurking nearby. It was indeed a trap! You need to burn a fuel cell to escape quickly.`,
            outcome: 'lose1',
            sound: 'badSound'
        }
    },
    
    encounter2: {
        trigger: {
            title: `Cosmic Phenomenon Emerges!`,
            image: `./imgs/encounter_2.png`,
            text: `A mesmerizing and radiant interstellar event begins to manifest before your eyes, its origin and nature unknown. The beauty and mystery beckon. Do you seize the moment?`,
            option1: `Dive in and document!`,
            option2: `Exercise caution; maintain distance`,
            sound: 'alertSound'
        },
        resolution1: {
            title: `Stellar Photography!`,
            image: `./imgs/encounter_2_resolution_1.png`,
            text: `You navigate your ship closer, capturing breathtaking images of the phenomenon. Nearby, an alien reconnaissance vessel, captivated by your audacity, approaches in peace. Impressed by your images and courage, they reward you with a fuel cell.`,
            outcome: 'gain1',
            sound: 'goodSound'

        },
        resolution2: {
            title: `A Near Miss!`,
            image: `./imgs/encounter_2_resolution_2.png`,
            text: `Exercising prudence, you decide to keep your distance. As you leave, you notice the vast energies from the event create unpredictable spatial waves.`,
            outcome: '',
            sound: 'goodSound'
        }
    },
    

    encounter3: {
        trigger: {
            title: `Ethereal Nebula Sighting!`,
            image: `./imgs/encounter_3.png`,
            text: `The vastness of space reveals a captivating nebula, shimmering with a myriad of colors and teeming with undiscovered lifeforms. Your sensors detect unusual bio-signatures. Could this be the moment you've been waiting for?`,
            option1: `Venture closer for a rare photo opportunity`,
            option2: `Chart its coordinates but keep a safe distance`,
            sound: 'alertSound'
        },
        resolution1: {
            title: `Bad photo op!`,
            image: `./imgs/encounter_3_resolution_1.png`,
            text: `With bated breath, you approach the nebula. Suddenly, a magnetic surge from the nebula affects your ship's navigation systems. You're forced to use a fuel cell to recalibrate, and you leave, disappointed.`,
            outcome: 'lose1',
            sound: 'badSound'
        },
        resolution2: {
            title: `Safety First!`,
            image: `./imgs/encounter_3.png`,
            text: `Recognizing the potential dangers of unknown territories, you log the nebula's coordinates for future reference and continue on your journey.`,
            outcome: '',
            sound: 'goodSound'

        }
    },
    

    encounter4: {
        trigger: {
            title: `Mysterious Merchant's Offer!`,
            image: `./imgs/encounter_4.png`,
            text: `A lone merchant ship, adorned with symbols from a distant galaxy, hails you. The captain offers you a weapon for two fuel cells.`,
            option1: `Trade 2 fuel cells for the weapon`,
            option2: `Decline the offer`,
            sound: 'alertSound'

        },
        resolution1: {
            title: `Galactic Armament Acquired!`,
            image: `./imgs/encounter_4_resolution_1.png`,
            text: `You decide to make the trade. The weapon is unlike anything you've seen before, pulsating with a mysterious energy. The merchant assures you of its potency against any space threats. As you hand over a fuel cell, you hope the trade proves to be worth it.`,
            outcome: 'lose2AndGainWeapon',
            sound: 'goodSound'
        },
        resolution2: {
            title: `Trust in Preparedness!`,
            image: `./imgs/encounter_4_resolution_2.png`,
            text: `You choose to decline the offer. You can't part with two fuel cells! The merchant nods, and departs.`,
            outcome: '',
            sound: 'goodSound'
        }
    },

    encounter5: {
        trigger: {
            title: `The Inescapable Grasp of a Black Hole!`,
            image: `./imgs/encounter_5.png`,
            text: `The serenity of space is abruptly disrupted as your ship's alarms blare. You've unknowingly ventured too close to a black hole! Its gravitational pull is immense, and escape seems improbable. Your ship's AI suggests jettisoning a fuel cell to generate a massive thrust. The choice is yours.`,
            option1: `Jettison a fuel cell to aid escape`,
            option2: `Attempt to escape without sacrificing fuel`,
            sound: 'alertSound'
        },
        resolution1: {
            title: `Desperate Measures, Successful Escape!`,
            image: `./imgs/encounter_5_resolution_1.png`,
            text: `You make the tough call and jettison a fuel cell. The resulting explosion provides the necessary thrust, propelling your ship out of the black hole's formidable grasp. You're safe, albeit with one less fuel cell.`,
            outcome: 'lose1',
            sound: 'goodSound'
        },
        resolution2: {
            title: `Gravitational Struggle!`,
            image: `./imgs/obstacle_1.png`,
            text: `You decide to trust your ship's capabilities and attempt to escape without sacrificing any fuel. The struggle is intense, and the black hole's pull is relentless. By the time you manage to break free, the excessive energy consumption has drained two of your fuel cells.`,
            outcome: 'lose2',
            sound: 'badSound'
        }
    }
    ,

    encounter6: {
        trigger: {
            title: `A Welcoming Space Station!`,
            image: `./imgs/encounter_6.png`,
            text: `As you traverse the vastness of space, a friendly transmission is received from a nearby space station. The station's commander invites you aboard for a short respite and mentions they have a busy cantina where wagers are made.`,
            option1: `Dock, rest, and trade for a fuel cell`,
            option2: `Visit the cantina and make a wager`,
            sound: 'alertSound'
        },
        resolution1: {
            title: `Successful Trade!`,
            image: `./imgs/encounter_6_resolution_1.png`,
            text: `You decide to dock and are warmly greeted by the inhabitants of the space station. After sharing stories of your adventures, you make a fair trade and secure a fuel cell. The station's inhabitants wish you well on your journey.`,
            outcome: 'gain1',
            sound: 'goodSound'
        },
        resolution2: {
            title: `A good wager!`,
            image: `./imgs/encounter_6_resolution_2.png`,
            text: `Eager to try your luck, you visit the cantina and spend the evening gambling. Luck is on your side, you win 2 fuel cells!`,
            outcome: 'gain2',
            sound: 'goodSound'
        }
    }
}

/*----- state variables -----*/
let speciesInstances = {};
let enemySteps = new Array(ENEMY_PATHS.length).fill(0); // creates an array with zeros to be able to track enemy step count
let enemyMoveInterval = setInterval(moveEnemies, 200); // Use setInterval as before to call moveEnemies periodically
let maze = MAP_LEVEL_ONE.map(row => row.slice()); // deep copy
let encounters = JSON.parse(JSON.stringify(ENCOUNTER_DESCRIPTIONS)); // Copies encounters object so I can remove encounters as they occur
let encounterToRemove = null;
let shipDirection = '0deg'
let isPlayerViewingModal = false // This is used to prevent movement while viewing a modal
let currentSelectedOption = 'option1'; // so I can highlight first button in choices modal
let eventListenersAttached = false; // Needed for the choices modal event listeners
let isGameOver = false
let speciesNames = [...SPECIES_NAMES] // Copies species names so that I can remove them from the array when found so they don't duplicate
let speciesImages = [...SPECIES_IMAGES ]
let speciesCongratsText = [...SPECIES_CONGRATS_TEXT]
class Species {
    constructor(speciesName, image, levelDiscovered, title, text){
        this.speciesName = speciesName
        this.image = image
        this.levelDiscovered = levelDiscovered
        this.title = title
        this.text = text
    }
}

// Audio, credits in HTML

let bgMusic = new Audio('./audio/music.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.08; 
bgMusic.play();


/*----- cached elements  -----*/
const mazeEl = document.querySelector('#maze')
const speciesPhotoTopEl = document.querySelector('#photo-top')
const speciesPhotoBottomEl = document.querySelector('#photo-bottom')
const speciesDescriptionTopEl = document.querySelector('#photo-top-description')
const speciesDescriptionBottomEl = document.querySelector('#photo-bottom-description')
const fuelContainerEl1 = document.querySelector('#fuel1')
const fuelContainerEl2 = document.querySelector('#fuel2')


/*----- event listeners -----*/

// Used for ship navigation
document.addEventListener("keydown", keyBehavior);

// Lets players turn off music
document.addEventListener("DOMContentLoaded", function() {
    let soundButton = document.getElementById('soundToggleBtn');
    if (bgMusic.paused) {
        soundButton.textContent = "Turn Music On";
        soundButton.classList.add('soundOff');
    } else {
        soundButton.textContent = "Turn Music Off";
        soundButton.classList.add('soundOn');
    }
});

/*----- functions -----*/

placeCreaturesAndObstacles(maze, 4, 5); // Randomizes creatures and encounters on maze

const preloadImage = src => {
    const img = new Image();
    img.src = src;
  };
  
  ['./imgs/blankphoto.png', './imgs/closeEncounterswireframe.png', './imgs/encounter_1.png', './imgs/encounter_1_resolution_1.png', './imgs/encounter_1_resolution_2.png', './imgs/encounter_2.png', './imgs/encounter_2_resolution_1.png', './imgs/encounter_2_resolution_2.png', './imgs/encounter_3.png', './imgs/encounter_3_resolution_1.png', './imgs/encounter_4.png', './imgs/encounter_4_resolution_1.png', './imgs/encounter_4_resolution_2.png', './imgs/encounter_5.png', './imgs/encounter_5_resolution_1.png', './imgs/encounter_6.png', './imgs/encounter_6_resolution_1.png', './imgs/encounter_6_resolution_2.png', './imgs/enemy_1.png', './imgs/enemy_2.png', './imgs/enemy_3.png', './imgs/enemy_ship_1.png', './imgs/fuel3.png', './imgs/fuel_small.png', './imgs/hero2.png', './imgs/obstacle_1.png', './imgs/ship.png', './imgs/species_1.png', './imgs/species_2.png', './imgs/species_3.png', './imgs/species_4.png', './imgs/species_5.png', './imgs/species_6.png', './imgs/star1.png', './imgs/stars.png', './imgs/unknown3.png', './imgs/weapon.png', './imgs/win.png'].forEach(preloadImage);
  
// I got tired of playing the same maze so this randomizes which unknown are creatures and obstacles; ChatGPT helped with this function
function placeCreaturesAndObstacles(maze, creatureCount, obstacleCount) {
  // Collect all the indices where creatures and obstacles can be placed.
  const placeablePositions = [];
  maze.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 6) {
        placeablePositions.push([rowIndex, colIndex]);
      }
    });
  });

  // Shuffle the placeable positions
  for (let i = placeablePositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [placeablePositions[i], placeablePositions[j]] = [placeablePositions[j], placeablePositions[i]];
  }

  // Place creatures (4) and obstacles (5)
  for (let i = 0; i < creatureCount; i++) {
    const [row, col] = placeablePositions.pop();
    maze[row][col] = 4;
  }
  for (let i = 0; i < obstacleCount; i++) {
    const [row, col] = placeablePositions.pop();
    maze[row][col] = 5;
  }
}

function keyBehavior(e) {
    e.preventDefault(); // prevents browser scrolling on keypress
  if (e.key === "ArrowUp") {
    shipDirection = '270deg'
    movePlayer('up')
  } else if (e.key === "ArrowDown") {
    shipDirection = '90deg'
    movePlayer('down')
  } else if (e.key === "ArrowRight") {
    shipDirection = '0deg'
    movePlayer('right')
  } else if (e.key === "ArrowLeft") {
    shipDirection = '180deg'
    movePlayer('left')
  }
}

function movePlayer(direction){
    if(isPlayerViewingModal){
        return
    }
    let desiredCell = getDesiredMoveCell(direction)
    let desiredCellValue = maze[desiredCell[0]][desiredCell[1]]
    if(desiredCellValue === 1){
        return
    } else if(desiredCellValue === 0){
        moveOnPath(desiredCell)
    } else if(desiredCellValue === 3){
        moveIntoEnemy(desiredCell)
    } else if(desiredCellValue === 4){
        moveIntoEncounter(desiredCell)
    } else if(desiredCellValue === 5){
        moveIntoCreature(desiredCell)
    }
    return
}

// Does the calculation to find the cell we want from the array based on direction of movement
function getDesiredMoveCell(directionOfMove) {
    let desiredPosition;
    if (directionOfMove === 'up') {
        desiredPosition = [player.mazePosition[0] - 1, player.mazePosition[1]];
    } else if (directionOfMove === 'down') {
        desiredPosition = [player.mazePosition[0] + 1, player.mazePosition[1]];
    } else if (directionOfMove === 'right') {
        desiredPosition = [player.mazePosition[0], player.mazePosition[1] + 1];
    } else if (directionOfMove === 'left') {
        desiredPosition = [player.mazePosition[0], player.mazePosition[1] - 1];
    }
    return desiredPosition;
}

function moveEnemies() {
    for (let i = 0; i < ENEMY_PATHS.length; i++) {
        moveEnemyAlongPath(i);
    }
}
function moveEnemyAlongPath(enemyIndex) {
    const path = ENEMY_PATHS[enemyIndex];
    const currentStep = enemySteps[enemyIndex];

    // If we've reached the end of the path, loop back to the beginning
    if (currentStep >= path.length) {
        enemySteps[enemyIndex] = 0;
        return;
    }

    // If it's not the first step, clear the previous position
    if (currentStep > 0) {
        const previousPosition = path[currentStep - 1];
        maze[previousPosition.y][previousPosition.x] = 0;
    }

    const nextPosition = path[currentStep];
    
    // Check for player collision
    if (isPlayerPosition(nextPosition.x, nextPosition.y)) {
        enemyCollision();
    }
    // Move to next position
    maze[nextPosition.y][nextPosition.x] = 3;

    renderMaze() 

    // Increase step count
    enemySteps[enemyIndex]++;

}

function updateMazeAndPlayerPosition(desiredCell){
    let cellMovedFrom = player.mazePosition
    maze[cellMovedFrom[0]][cellMovedFrom[1]] = 0 // Makes the cell we just left a 0 (path)
    player.mazePosition = desiredCell
    maze[player.mazePosition[0]][player.mazePosition[1]] = 2 // Makes the current cell a 2 (player's ship)
    renderMaze()
}

function moveOnPath(desiredCell){
    updateMazeAndPlayerPosition(desiredCell)

}

function moveIntoEnemy(){
    let cellMovedFrom = player.mazePosition
    maze[cellMovedFrom[0]][cellMovedFrom[1]] = 0
    enemyCollision()
}

function moveIntoEncounter(desiredCell){
    updateMazeAndPlayerPosition(desiredCell)
    encounterTrigger()
}

function moveIntoCreature(desiredCell){
    updateMazeAndPlayerPosition(desiredCell)
    creatureCollision()
}



function isPlayerPosition(x, y) {
    return maze[y][x] === 2;
}


function enemyCollision(){
    playSoundByIdentifier('enemySound')
    if(!player.hasWeapon){ // pew pew
        changeFuel(-1)
    }  
    if(player.fuelCells < 1){

        if(!isGameOver){ // This is preventing a loop; couldn't figure out how to properly prevent this so added a flag check
            triggerGameOver('enemy')
        } else {
        }
    } else {
        renderEnemyModal()
    }
    if(!isGameOver){ // Moves the player back to the maze start if they hit an enemy but still have fuel
        player.mazePosition = PLAYER_START.mazePosition
        maze[player.mazePosition[0]][player.mazePosition[1]] = 2
    }
}


// Selects a random encounter, sends it to the display modal, then sets encounterToRemove so it can be deleted after used
function encounterTrigger(){
    const encounterKeys = Object.keys(encounters);  
    const randomIndex = randomNumber(encounterKeys.length); 
    const randomEncounterKey = encounterKeys[randomIndex];   

    encounterToRemove = randomEncounterKey;
    const currentEncounter = encounters[randomEncounterKey]; 
    showChoicesModal('encounterTrigger', currentEncounter);
}


function creatureCollision(){
    playSoundByIdentifier('goodSound')
    player.creaturesFound += 1
    renderCreatureModal()
    render()
}


function triggerGameOver(){
    isGameOver = true;
    closeDisplayModal()
    soundOff()
    player.mazePosition = PLAYER_START.mazePosition;
    const obj = {
        title: 'GAME OVER',
        img: './imgs/fuel3.png',
        text: `You ran out of fuel! <br><br> Creatures found: ${player.creaturesFound}<br><br> Restarting in <b><span id="countdown">10</span></b> seconds...`,
    }
    document.body.classList.add('shake-effect');
    setTimeout(function() { // shakes screen for 2 seconds
        document.body.classList.remove('shake-effect');
        playSoundByIdentifier('gameOverSound')
        showDisplayModal('gameOver', obj); 
    }, 2000);
    restartGameAfterDelay();
}


function restartGameAfterDelay(){
    let timeLeft = RESTART_DELAY / 1000;
    countdownInterval = setInterval(function() {
        timeLeft -= 1;
        if(document.getElementById('countdown')){
            document.getElementById('countdown').innerText = timeLeft;
        }

        if(timeLeft <= 0) {
            clearInterval(countdownInterval); 
            restartGame();
        }
    }, 1000);
}



function makeMazeDiv(classValue, isPlayer, direction) {
    const divEl = document.createElement('div');
    // If it's fog, add the 'fog' class, otherwise use the class from GRID_CLASSES
    divEl.classList.add(classValue === 'fog' ? 'fog' : GRID_CLASSES[classValue]);
    if (isPlayer) { // rotates ship before rendering
        divEl.style.transform = `rotate(${direction})`;
    }
    mazeEl.appendChild(divEl);
}



function randomNumber(max){
    return Math.floor(Math.random() * max);
}

function encounterResolution(currentEncounter, selectedOption){
    closeModal('choices-modal')
    currentSelectedOption = 'option1' // resets this for the new choices modal display
    const currentResolution = currentEncounter['resolution'+selectedOption]
    let outcome = currentResolution.outcome
    if(outcome){
        if(outcome === 'gain1'){
            changeFuel(1)
        } else if (outcome === 'gain2'){
            changeFuel(2)
        } else if (outcome === 'lose1'){
            changeFuel(-1)
        } else if (outcome === 'lose2'){
            changeFuel(-2)
        } else if (outcome === 'lose2AndGainWeapon'){
            changeFuel(-2)
            player.hasWeapon = true
        } else {
        }
    } else {
        changeFuel(0)
    }
    delete encounters[encounterToRemove]
    showDisplayModal('encounterResolution', currentResolution);

}

function renderCreatureModal(){
    let randomNumSpeciesName = randomNumber(speciesNames.length)
    let randomNumSpeciesImage = randomNumber(speciesImages.length)
    let randomNumSpeciesCongratsText = randomNumber(speciesCongratsText.length)
    let randomSpecies = speciesNames[randomNumSpeciesName]
    let randomImage = speciesImages[randomNumSpeciesImage]
    let randomCongratsText = speciesCongratsText[randomNumSpeciesCongratsText]
    let title = 'You found a new species!'
    let text = `${randomCongratsText} You decide to name them: <br><br> <span class="center"><h2>${randomSpecies}</h2></span><br>Well done! New species found: ${player.creaturesFound}`

    speciesInstances[randomSpecies] = new Species(randomSpecies, randomImage, player.level, title, text);

    speciesNames.splice(randomNumSpeciesName, 1)  // Removes the used species name so that it can't be duplicated later
    speciesImages.splice(randomNumSpeciesImage, 1)
    renderPhoto(randomSpecies)
    showDisplayModal('creature', speciesInstances[randomSpecies], );

}
// ICEBOX - Would like to make this a separate object like encounters
function renderEnemyModal(){
    const enemyImages = ['./imgs/enemy_1.png', './imgs/enemy_2.png', './imgs/enemy_3.png']
    const enemyText = [`"You're brave coming out here in that, kid. Stupid though."`, `"Space isn't big enough for the both of us."`, `"You're just wasting fuel out here, loser."`, `"Oh good, I was getting bored out here."`, `"I know it's wrong but ... meh, I don't really care."` ]
    let randomImage = enemyImages[randomNumber(enemyImages.length)]
    let randomText = enemyText[randomNumber(enemyText.length)]
    const enemyObj = {
        title: 'Another ship attacked you!',
        image: randomImage,
        text: `${randomText}. <br><br> They stole a fuel cell!`
    }
    const weaponObj = {
        title: 'Weapons test',
        image: './imgs/weapon.png',
        text: `You're not going down without a fight. You line up your weapon and fire: It's a hit! The enemy ship flees.`
    }

    if(player.hasWeapon){ // Passes different objects if they have the weapon
        showDisplayModal('enemy', weaponObj);
    } else {
    showDisplayModal('enemy', enemyObj);
    }
    
}

function showChoicesModal(type, currentEncounter) {
    isPlayerViewingModal = true;
    currentEncounterGlobal = currentEncounter; // So that I can access this from the handleoptionclick functions
    document.getElementById('option1').classList.add('highlight');
    document.getElementById('option2').classList.remove('highlight');
    // Caching elements
    let modalTitleEl = document.getElementById('choices-modal-title');
    let modalImageEl = document.getElementById('choices-modal-image');
    let modalDescriptionEl = document.getElementById('choices-modal-description');
    let choice1 = document.getElementById('option1');
    let choice2 = document.getElementById('option2');
    
    // Attach event listeners only if they haven't been attached before
    if (!eventListenersAttached) {
        document.getElementById('option1').addEventListener('click', handleOption1Click);
        document.getElementById('option2').addEventListener('click', handleOption2Click);
        eventListenersAttached = true; // Set a flag indicating that the event listeners are attached
    }
    document.addEventListener('keydown', handleChoicesKeypress)

    // Show modal
    document.getElementById('choices-modal').classList.remove('hidden');
    
    // Conditionals
    if(type === 'encounterTrigger'){
        modalTitleEl.innerText = currentEncounter.trigger.title
        modalImageEl.src = currentEncounter.trigger.image
        modalDescriptionEl.innerHTML = currentEncounter.trigger.text
        choice1.innerText = currentEncounter.trigger.option1
        choice2.innerText = currentEncounter.trigger.option2
        playSoundByIdentifier(currentEncounter.trigger.sound)
    } 
}

function showDisplayModal(type, currentEncounter) {
    isPlayerViewingModal = true
    fuelRender()
    // Caching elements
    let modalTitleEl = document.getElementById('display-modal-title');
    let modalImageEl = document.getElementById('display-modal-image');
    let modalDescriptionEl = document.getElementById('display-modal-description');
    
    // Adding event listeners to exit modal only if game is still running, and adds a delay so the player doesn't mistakenly dismiss while moving ship
    setTimeout(() => {
        if(!isGameOver){
            document.addEventListener('keydown', closeDisplayModal);
            document.getElementById('display-modal').addEventListener('click', closeDisplayModal)
        }
      }, "500");
      
    
    

    // Show modal
    document.getElementById('display-modal').classList.remove('hidden');
    
    // Conditionals
    if(type === 'intro'){
        modalTitleEl.innerText = "Close Encounters of the Cute Kind"
        modalImageEl.src = "./imgs/hero2.png"
        modalDescriptionEl.innerHTML = STORYLINE
    } else if (type === 'encounterResolution'){
        modalTitleEl.innerText = currentEncounter.title
        modalImageEl.src = currentEncounter.image
        modalDescriptionEl.innerHTML = currentEncounter.text
        playSoundByIdentifier(currentEncounter.sound)
    } else if (type === 'creature'){
        modalTitleEl.innerText = currentEncounter.title
        modalImageEl.src = currentEncounter.image
        modalDescriptionEl.innerHTML = currentEncounter.text
    } else if (type === 'gameOver'){
        modalTitleEl.innerText = currentEncounter.title
        modalImageEl.src = currentEncounter.img
        modalDescriptionEl.innerHTML = currentEncounter.text
    } else if (type === 'enemy'){
        modalTitleEl.innerText = currentEncounter.title
        modalImageEl.src = currentEncounter.image
        modalDescriptionEl.innerHTML = currentEncounter.text
    } else if(type === 'gameWon'){
        modalTitleEl.innerText = currentEncounter.title
        modalImageEl.src = currentEncounter.image
        modalDescriptionEl.innerHTML = currentEncounter.text
        let timeLeft = RESTART_DELAY / 1000;
        countdownInterval = setInterval(function() {
            timeLeft -= 1;
            if(document.getElementById('countdown')){
                document.getElementById('countdown').innerText = timeLeft;
            }
    
            if(timeLeft <= 0) {
                clearInterval(countdownInterval); 
                restartGame();
            }
        }, 1000);
        
    }
}

function handleOption1Click() {
    if (isPlayerViewingModal) {
        encounterResolution(currentEncounterGlobal, 1);
    }
}

function handleOption2Click() {
    if (isPlayerViewingModal) {
        encounterResolution(currentEncounterGlobal, 2);
    }
}

function handleChoicesKeypress(e) {
    
    if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "ArrowDown") {
        // Toggle the selected option
        document.getElementById(currentSelectedOption).classList.remove('highlight'); 
        currentSelectedOption = currentSelectedOption === 'option1' ? 'option2' : 'option1'; 
        document.getElementById(currentSelectedOption).classList.add('highlight'); 
    } else if (e.key === "Enter" || e.key === " ") {
        // Trigger the selected option's click event
        document.getElementById(currentSelectedOption).click();
    }
}

function closeDisplayModal() {
    document.getElementById('display-modal').classList.add('hidden');
    isPlayerViewingModal = false;
    // Remove the listeners once the modal is closed
    document.removeEventListener('keydown', closeDisplayModal);
    document.getElementById('display-modal').removeEventListener('click', closeDisplayModal)
    document.removeEventListener('keydown', handleChoicesKeypress)
    // Check if game won
    if(player.creaturesFound === 4 || player.creaturesFound === 8){
        triggerNextLevel()
        return
    }
    if(!isGameOver){
        if(player.fuelCells <= 0){
            triggerGameOver()
        }
    }
}

function closeModal() {
    isPlayerViewingModal = false
    document.getElementById('choices-modal').classList.add('hidden');
    document.removeEventListener('keydown', handleChoicesKeypress)
}

function handleModalClickOutside(elId, event) {
    if (event.target === document.getElementById(elId)) {
        closeModal(elId);
    }
}

function changeFuel(amount){
    player.fuelCells += amount; 
    fuelRender();
}

function fuelRender(){
    fuelContainerEl1.innerHTML = ''
    fuelContainerEl2.innerHTML = ''

    for(let i = 0; i < player.fuelCells; i++){
        let imgEl1 = document.createElement('img');
        let imgEl2 = document.createElement('img');
        imgEl1.src = "./imgs/fuel_small.png";
        imgEl2.src = "./imgs/fuel_small.png";
        fuelContainerEl1.appendChild(imgEl1);
        fuelContainerEl2.appendChild(imgEl2);
    }
}

function renderMaze() {
    mazeEl.innerHTML = '';
    const playerPos = player.mazePosition;
    const playerDir = shipDirection; // assuming shipDirection is a global variable keeping track of the player's current direction

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (isVisibleToPlayer(playerPos, playerDir, x, y)) {
                // If the cell is visible to the player
                makeMazeDiv(maze[y][x], isPlayerPosition(x, y), playerDir);
            } else {
                makeInvisibleMazeDiv();
            }
        }
    }
}

function makeInvisibleMazeDiv() {
    const divEl = document.createElement('div');
    divEl.classList.add('fog');
    mazeEl.appendChild(divEl);
}

// This function was Penned via standard programming aids
function isVisibleToPlayer(playerPos, playerDir, x, y) {
    // Player's current position is always visible.
    if (x === playerPos[1] && y === playerPos[0]) {
        return true;
    }

    // Calculate the relative position of the cell to the player.
    const deltaX = x - playerPos[1];
    const deltaY = y - playerPos[0];

    // Cells directly adjacent to the player should also always be visible.
    if (Math.abs(deltaX) <= 1 && Math.abs(deltaY) <= 1) {
        return true;
    }

    // Determine visibility based on player's direction for cells further away.
    switch (playerDir) {
        case '0deg': // facing right
            return deltaY >= -2 && deltaY <= 2 && deltaX > 0 && deltaX <= 3 ||
                   Math.abs(deltaY) <= 1 && deltaX > 3 && deltaX <= 5;
        case '90deg': // facing down
            return deltaX >= -2 && deltaX <= 2 && deltaY > 0 && deltaY <= 3 ||
                   Math.abs(deltaX) <= 1 && deltaY > 3 && deltaY <= 5;
        case '180deg': // facing left
            return deltaY >= -2 && deltaY <= 2 && deltaX < 0 && deltaX >= -3 ||
                   Math.abs(deltaY) <= 1 && deltaX < -3 && deltaX >= -5;
        case '270deg': // facing up
            return deltaX >= -2 && deltaX <= 2 && deltaY < 0 && deltaY >= -3 ||
                   Math.abs(deltaX) <= 1 && deltaY < -3 && deltaY >= -5;
        default:
            return false; // If direction is unknown, no cells are visible
    }
}




function renderPhoto(name){
    if(speciesPhotoTopEl.classList.contains('blank')){
        speciesPhotoTopEl.src = speciesInstances[name].image
        speciesPhotoTopEl.classList.remove('blank')
        speciesDescriptionTopEl.innerHTML = `Species: <b>${name}</b>`
    } else {
        speciesPhotoBottomEl.classList.contains('blank')
            speciesPhotoBottomEl.src = speciesInstances[name].image
            speciesPhotoBottomEl.classList.remove('blank')
            speciesDescriptionBottomEl.innerHTML = `Species: <b>${name}</b>`
    }
}

function restartGame(){
    // Reset photos
    speciesPhotoTopEl.src = "./imgs/blankphoto.png"
    speciesPhotoBottomEl.src = "./imgs/blankphoto.png"
    speciesDescriptionTopEl.innerText = 'Species: Undiscovered.'
    speciesDescriptionBottomEl.innerText = 'Species: Undiscovered.'
    document.getElementById('display-modal').classList.add('hidden'); // Hide the game over modal
    encounters = JSON.parse(JSON.stringify(ENCOUNTER_DESCRIPTIONS));
    maze = MAP_LEVEL_ONE.map(row => row.slice());
    shipDirection = '0deg'
    isPlayerViewingModal = false // This is used to prevent movement while viewing a modal
    currentSelectedOption = 'option1';
    encounterToRemove = null; 
    speciesNames = [...SPECIES_NAMES] // Copies species names so that I can remove them from the array when found so they don't duplicate
    speciesImages = [...SPECIES_IMAGES ]
    speciesCongratsText = [...SPECIES_CONGRATS_TEXT]
    speciesInstances = {};
    isGameOver = false
    player = {
        ...PLAYER_START,
        mazePosition: [...PLAYER_START.mazePosition]
    
    };
    placeCreaturesAndObstacles(maze, 4, 5);
    init()
}
function triggerNextLevel(){ 
    if(player.creaturesFound === 4){ // Change this to 8 when adding new level
        triggerGameWon()
    } else {
        // This is where new level reset code goes
    }
}

function triggerGameWon(){
    isGameOver = true
    playSoundByIdentifier('gameWinSound')
    const gameWon = {
        title: 'YOU WIN!',
        image: './imgs/win.png',
        text: `You found 4 creatures and your photos are lifting earth's spirits, well done! <br><br>Game will restart in <span id="countdown">10</span> seconds...`
    }
    showDisplayModal('gameWon', gameWon)
}
// Because I reference sounds in my encounters object before I initialize them I need to reference sound by string, so this matches the strings to the filename
function getSoundByIdentifier(identifier) {
    let audio = new Audio();
    audio.volume = 0.3;
  
    if (identifier === 'badSound') {
      audio.src = './audio/bad_1.mp3';
      audio.volume = 0.3; 
    } else if (identifier === 'goodSound') {
      audio.src = './audio/good_1.mp3';
      audio.volume = 0.3; 
    } else if (identifier === 'enemySound') {
      audio.src = './audio/enemyCollide.mp3';
    } else if (identifier === 'gameOverSound') {
      audio.src = './audio/gameOver.mp3';
      audio.volume = 0.3; 
    } else if (identifier === 'gameWinSound') {
      audio.src = './audio/gameWin.mp3';
      audio.volume = 0.3;
    } else if (identifier === 'alertSound') {
      audio.src = './audio/alert.mp3';
      audio.volume = 0.3;
    } else {
      console.error('No sound found for identifier:', identifier);
      return null;
    }
  
    return audio;
  }

function playSoundByIdentifier(identifier) {
    const sound = getSoundByIdentifier(identifier);
    if (sound) {
      sound.play();
    }
  }

function toggleSound() {
    let soundButton = document.getElementById('soundToggleBtn');
    
    if (bgMusic.paused) {
        bgMusic.play();
        soundButton.textContent = "Turn Music Off";
        soundButton.classList.remove('soundOff');
        soundButton.classList.add('soundOn');
    } else {
        bgMusic.pause();
        soundButton.textContent = "Turn Music On";
        soundButton.classList.remove('soundOn');
        soundButton.classList.add('soundOff');
    }
}

function soundOff(){
    let soundButton = document.getElementById('soundToggleBtn');
    bgMusic.pause();
        soundButton.textContent = "Turn Music On";
        soundButton.classList.remove('soundOn');
        soundButton.classList.add('soundOff');
}


function render(){
    renderMaze()
}

function init(){

    render()
    showDisplayModal('intro');
}

render()
init()