/*
DESCRIPTION
Javascript file which controls the actions of interactive elements in the html page, the choice of new events to display and how they are displayed.

Inside the same folder there is a csv file with semicolon as a separator of columns, containing the name of the columns in the first row, and cell data containing newline.

This project is made to be used only locally : no server needed, no Internet needed. 

DATE
March-April 2024

AUTHORS
The idea and structure of the project (structure/algorithms) of the functions
were created by Anaïs Kobsch, the Javascript implementation was Produced using standard development resources-3.5 
through Chat-GPT interface.

WARNING
The following description of functions and event listeners were made at the very beginning of the project
in order to guide Chat-GPT. Subsequent improvements (as errors handling) may not be integrated to the descriptions.


GLOBAL VARIABLES :
    events (array) database
    index (integer) of the current event
    positions (array of tuple) of displayed event (null if not displayed)
    not_displayed (array of integers) indexes of events to display in the future
    space  (integer, constant) 
    event_height (integer, constant) 
    good_answers (integer) !! replaced by the array playerScores !!
    x0,y0 (integers)

*/
let csvData; // csv raw data 
let events = []; // Array to store parsed events
let index; // index of the current event
let positions = []; // positions x,y of displayed events
let not_displayed = []; // indexes of not displayed events
const space = 10; // space in pixels between two event blocks
const event_height = 50; // height of an event block
let playerScores = []; // array of dictionaries for scores of each players
let player_ID = 1; // ID of the current player
let x0 = 0; let y0 = 0 ; // initial coordinates, updated by the computeInitialCoordinates function
let readmeContent = ""; // content of the readme file
let countdownInterval; // for the timer

/*
FUNCTIONS :
    readDataFromFile
        INPUT : the csv file described above
        OUTPUT : a text representing the content of the file
    parseCSV
        INPUT : the text (csvData) given by the readDataFromFile function
        OUTPUT : an array of dictionaries : each row is a dictionary, the keys are the column headers, the values are the content of the cells. Empty rows are deleted.
    choose_random
        INPUT : the array not_displayed containing integers
        OUTPUT : one of the element of the array randomly chosen 
    correct_interval 
        INPUT : answer (positive or negative integer), index (integer)
        OUTPUT : boolean
        * From the positions array, create a new array containing all the intervals between two consecutive dates of displayed elements : 
        intervals, first = [], True
        for i in range(len(positions)):
            if positions[i] != null:
                if first:
                    intervals.append( (-float(inf),int(events[i])) )
                    first = False
                else:
                    intervals.append( (intervals[-1][1],int(events[i])) )
        intervals.append( (intervals[-1][1],float(inf)) )
        
        The previous code should give [(-inf,-200),(-200,2),(2,5),(5,inf)] with inf representing infinity) if we have the dates [-200,2,5]
        * Get the index of the intervals array, named I_index in which the date of the event (at the row number index in the events array) is located :
        date = events[index]['Date']
        for i in range(len(intervals)):
            b,e = intervals[i][0], intervals[i][1]
            if date > b and date < e:
                I_index, approx = i, 0
            elif date == b:
                I_index, approx = i, -1
            elif date == e:
                I_index, approx = i, 1
                
        To continue the previous example, if the date of the event is -1000 then the I_index should be 0, if the date is 3 then the I_index is 2, if the date is 1992 the I_index is 3 and in these three cases the approx is 0.  If the date is 2 then the I_index is 1 and approx is 1.
        * Use the same method to get the A_index corresponding to the index found using the answer variable.
        * if A_index == I_index or A_index == I_index+approx :
              return True
          else:
              return False.
    computePosition
        INPUT : index (integer)
        OUTPUT : x,y,i (integers)
    
        date = events[index]["Date"]
        x,y,idx = x0,y0,-1 # default value = beginning of the timeline
        for i in range(0,len(positions)):
            if positions[i] is not null:
                if date >= events[i]["Date"] :
                    x,y,idx = positions[i][0], positions[i][1]+space,i
        return x,y,idx
    addEventToTimeline
        INPUT :  x,y tuple of coordinates, index  (integer)
        OUTPUT : undefined
        * The element of the global variable positions (array) at the index index takes the value (x,y).
        * Add the date and title of the event number index (in the events array) to the timeline (new html div of class event and id index) at the coordinates x,y .
    updateEventPosition
        INPUT : move_id (integer)
        OUTPUT : undefined
        * for i in range(move_id,len(positions)):
            positions[i][1] = positions[i][y]+val
            change the position of the html element of index i with the value of positions[i]
*/
// Function to read data from text file using FileReader
async function readDataFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = () => {
            reject(reader.error);
        };
        reader.readAsText(file);
    });
}

// Function to parse CSV data using PapaParse
function parseCSV(csvData) {
    const parsedData = Papa.parse(csvData, { header: true }).data;
    // Filter out rows that are completely empty
    const nonEmptyRows = parsedData.filter(row => Object.values(row).some(value => value !== ''));
    // Get the selection of events
    const selection = document.getElementById('select').value;
    if (selection == 'Toutes') {
        return nonEmptyRows;
    }
    else {
        // Only keep rows where 'Catégorie_principale' or 'Catégorie_secondaire' matches the selection
        return nonEmptyRows.filter(row => row['Catégorie_principale'] === selection || row['Catégorie_secondaire'] === selection);
    }
}

// Function to choose a random element from an array
function choose_random(not_displayed) {
    // Generate a random index between 0 and the length of the array
    const randomIndex = Math.floor(Math.random() * not_displayed.length);
    // Return the element at the random index
    return not_displayed[randomIndex];
}

// Function to add event to the timeline with correct position
function addEventToTimeline(x, y, index) {
    //console.log("positions before add event",JSON.stringify(positions));
    // Update the position of the event at the given index
    positions[index] = [x, y];
    //console.log("index of the event to add",index)
    //console.log("positions after add event",JSON.stringify(positions));
    // Get the event details from the events array
    const event = events[index];
    const date = event['Date'];
    const title = event['Titre'];
    const ximg = -80;
    const yimg = 0;
    // Create HTML for the event div
    const eventHTML = `
            <div class="event" id="${index}" style="top: ${y}px; left: ${x}px;">
                <div class="event-content"
                    <p><b>${date}</b>: ${title}</p>
                </div>
                ${event.Fichier_img ? `<img src="img/${event.Fichier_img}" alt=" "
                class="event-img" id="img${index}" style="top: ${yimg}px; left: ${ximg}px;">` : ''}
            </div>
    `;
    // Append the event HTML to the timeline container
    const timelineContainer = document.querySelector('.timeline-container');
    timelineContainer.insertAdjacentHTML('beforeend', eventHTML);
}

// Function to compute initial coordinates for the first event
function computeInitialCoordinates() {
    const initialX = 550;
    const initialY = 20;
    return [initialX, initialY] ;
}

const initialCoordinates = computeInitialCoordinates();
x0 = initialCoordinates[0]; y0=initialCoordinates[1];

function correct_interval(answer, index) {
    // Create intervals array
    const intervals = [];
    let first = true;
    for (let i = 0; i < positions.length; i++) {
        if (positions[i] !== null) {
            if (first) {
                intervals.push([-Infinity, parseInt(events[i].Date)]);
                first = false;
            } else {
                intervals.push([intervals[intervals.length - 1][1], parseInt(events[i].Date)]);
            }
        }
    }
    intervals.push([intervals[intervals.length - 1][1], Infinity]);
    // Get I_index
    const date = parseInt(events[index].Date);
    let I_index, approx;
    for (let i = 0; i < intervals.length; i++) {
        const [b, e] = intervals[i];
        if (date > b && date < e) {
            I_index = i;
            approx = 0;
            break;
        } else if (date === b) {
            I_index = i;
            approx = -1;
            break;
        } else if (date === e) {
            I_index = i;
            approx = 1;
            break;
        }
    }
    // Get A_index
    let A_index = 0;
    while (answer > 0 && answer >= intervals[A_index][1]) {
        A_index++;
    }
    // Check if A_index equals I_index or I_index + approx
    return A_index === I_index || A_index === I_index + approx;
}

function computePosition(index) {
    //console.log("positions",JSON.stringify(positions));
    const date = parseInt(events[index]["Date"]);
    for (let i = 0; i < positions.length; i++) {
        //console.log("pos",JSON.stringify(positions[i]),"date",parseInt(events[i]["Date"]),"ref",date);
        if (positions[i] != null) {
            pos = positions[i];
            //console.log("pos !== null", "i=", i);
            //console.log('type of',typeof parseInt(events[i]["Date"]), typeof date);
            //console.log("test", date, "<", parseInt(events[i]["Date"]),":",date < parseInt(events[i]["Date"]));
            //console.log("test2 : equality and", index, "<", i ,":",date == parseInt(events[i]["Date"]) && index < i );
            if (date < parseInt(events[i]["Date"]) || date == parseInt(events[i]["Date"]) && index < i ) {
                x = positions[i][0];
                y = positions[i][1];
                //console.log("x,y = x_event, y_event =",x,y,"i=",i);
                return [x,y,i]
            }
        }
    }
    x = pos[0];
    y = pos[1] + space+event_height;
    //console.log("date >= last event. x,y =", x,y ,"return i=",-1);
    return [x, y, -1];
}

function updateEventPosition(move_id) {
    //console.log("positions before update",JSON.stringify(positions) );
    if (move_id !== -1) {
        for (let i = move_id; i < positions.length; i++) {
            if (positions[i] !== null) {
                positions[i][1] += event_height+space;
                const eventElement = document.getElementById(i.toString());
                eventElement.style.top = `${positions[i][1]}px`;
                const eventimgElement = document.getElementById("img"+i.toString());
                eventimgElement.style.top = `0px`;//`${positions[i][1]}px`;
                //if (i%2 === 0) {
                    eventimgElement.style.left = `-80px`;//`${x0}px`;
                //}
                //else {
                //    eventimgElement.style.left = `${100+eventElement.offsetWidth}px`;
                //}
            }
        }
    }
    //console.log("positions after update",JSON.stringify(positions) );
}


function showDescription(index) {
    // Get the event object at the chosen index
    const chosenEvent = events[index];
    // Get the current-event element
    const currentEventElement = document.getElementById('current-event');
    // Get the p element inside the current-event element
    const descriptionElement = currentEventElement.querySelector('p');
    // If there is a description
    if (descriptionElement) {
        // If there is a description, simulate a click on the next event button
        document.getElementById('next-event-btn').dispatchEvent(clickEvent);
    } else {
        // Update the inner HTML of the current-event element with the description
        currentEventElement.innerHTML = `
        <h3>${chosenEvent.Titre} &rarr; ${chosenEvent.Date}</h3>
        <p>${chosenEvent.Description}</p>
        ${chosenEvent.Fichier_img ? `<img src="img/${chosenEvent.Fichier_img}" alt=" ">` : ''}
        `;
    }
}



function updatePlayers() {
    const joueursSelect = document.getElementById('joueurs');
    const numberOfPlayers = parseInt(joueursSelect.value);
    const scoresDiv = document.getElementById('scores');
    // Reset the playerScores and ID
    playerScores = [] ; 
    player_ID = 1 ;
    // Create an array of dictionaries for each player
    for (let i = 0; i < numberOfPlayers; i++) {
        playerScores.push({
            'nb-perfect': 0,
            'nb-points': 0,
            'nb-mistakes': 0
        });
    }
    // Update the content of the scores div
    scoresDiv.innerHTML = ''; // Clear existing content
    for (let i = 1; i <= numberOfPlayers; i++) {
        const playerDiv = document.createElement('div');
        playerDiv.innerHTML = `
            <h4>Joueur ${i}</h4>
            <p style="color: #ffdc00;"><b><span id="nb-perfect${i}">0</span> dates exactes</b></p>
            <p style="color: green;"><b><span id="nb-points${i}">0</span> réussites</b></p>
            <p style="color: red;"><b><span id="nb-mistakes${i}">0</span> erreurs</b></p>
        `;
        playerDiv.id = 'J' + i;
        scoresDiv.appendChild(playerDiv);
    }
    // Initialize the first box to show the current player
    document.getElementById('J'+player_ID).style.border = '2px solid black';
}

// Function to update player ID and the border of the box to show the current player
function updatePlayerID() {
    document.getElementById('J'+player_ID).style.border = null;
    const numberOfPlayers = playerScores.length;
    if (player_ID < numberOfPlayers) {
        player_ID++; // Increment player ID by 1 if it's less than the number of players
    } else {
        player_ID = 1; // Reset player ID to 1 if it reaches the number of players
    }
    document.getElementById('J'+player_ID).style.border = '2px solid black';
}


// Function to show the help popup
function showHelp() {
    // Make visible the popup object
    const popupObject = document.getElementById('helpPopup');
    popupObject.style.display = 'block';
}
// Function to hide the help popup
function hideHelp() {
    // Hide the popup object
    const popupObject = document.getElementById('helpPopup');
    popupObject.style.display = 'none';
}

// Function to initialize data == (re)start the game
function startGame() {
    events = parseCSV(csvData);
    if (events.length > 0) {
        // Reset the timeline
        document.getElementById('main-content').innerHTML = `<div class="timeline-container"></div>`;
        // Initialize positions and not_displayed arrays
        positions = Array(events.length).fill(null);
        not_displayed = Array.from({ length: events.length }, (_, i) => i);
        // Choose random index
        index = choose_random(not_displayed)
        // Add the first event to the timeline
        addEventToTimeline(x0,y0,index)
        not_displayed.splice(index, 1);
        document.getElementById('nb_events').innerHTML = `${not_displayed.length}`;
        document.getElementById('csv-file-input').style.display = 'none';
	// Show the description of the first event
	const currentEventElement = document.getElementById('current-event');
	currentEventElement.innerHTML = ``;
	showDescription(index);
        // Initialize the players
        updatePlayers()
    }
    else {
        alert('No events found in the CSV file!');
    }
}



function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    clearInterval(countdownInterval); // Clear any existing interval

    countdownInterval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(countdownInterval);
            display.textContent = "00:00";
            display.style.color = 'red';
            // Optionally add actions when the timer ends
        } else {
            display.style.color = ''; // Reset text color
        }
    }, 1000);
}

function resetTimer() {
    const temps = 60 * 1, display = document.getElementById('timerOverlay');
    display.style.color = ''; // Reset text color to default
    startTimer(temps, display);
}

/*
EVENT LISTENERS :
1)  linked to the file button 'csv-file-input'
    when the file is set by the user do : 
        - execute the readDataFromFile function and store the data inside a global variable named csvData
2)  linked to the start button
        - execute the parseCSV function and store the array inside a global variable named events
        - create an array (global variable), named positions, containing X null elements, X being the number of rows in the events array.
        - create an array (global variable), named not_displayed, containing integers from 0 to X, X being the number of rows in the events array.
        - execute the choose_random function with not_displayed as input and store the output value inside an index variable.
        - compute the x,y coordinates of the center of the web page and add this tuple to the positions variable at the index previously obtained.
        - execute the function addEventToTimeline with the x,y tuple and the index as input
        - remove the index from the not_displayed array
        - hide the file selection 
2)  linked to the "next-event-btn" button
    when the user click on this button do :
        - execute the choose_random function with not_displayed as input and store the output value inside an index variable
        - change the content of the html element 'current-event' to put the title of the event in the row number index of the events array
3)  linked to the "answer" text input field
    when the enter key is pressed (is that possible ? do we need a submit button instead ?)
        - store the content of the input field inside an answer variable
        - if the variable is a positive or negative integer :
            - execute the function correct_interval with the answer and index as input and store the output in a variable named res.
            - if res is true then :
                - add 1 to the global counter good_answers
            - execute the function computePosition with the index as input and store the two first values of the output into the variable pos, and the third value into the variable move_id
            - execute the function addEventToTimeline with the pos tuple and the index as input
            - remove the index from the not_displayed array
            - execute the function updateEventPosition with move_id as input
*/
// Function to handle file input change event
document.getElementById('csv-file-input').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    console.log(file)
    try {
        csvData = await readDataFromFile(file);
    } catch (error) {
        console.error('Error reading CSV file:', error);
        alert('Error reading CSV file. Please check if the file is valid.');
    }
});

// Event listener for the start button
document.getElementById('start').addEventListener('click', startGame);


// Linked to the "next-event" button
document.getElementById('next-event-btn').addEventListener('click', () => {
    // Execute the choose_random function with not_displayed as input and store the output value in the global index variable
    index = choose_random(not_displayed);
    // Handle the end of the game
    if (index == undefined) {
        alert("Il n'y a plus d'événements à placer !")
    }
    else {
    // Get the event object at the chosen index
    const chosenEvent = events[index];
    // Change the content of the HTML element 'current-event' to put the title of the event at index
    document.getElementById('current-event').innerHTML = `
        <h3>${chosenEvent.Titre}</h3>
        ${chosenEvent.Fichier_img ? `<img src="img/${chosenEvent.Fichier_img}" alt=" ">` : ''}
    `;
    resetTimer(); // Reset and start the timer when a new card is drawn
    }
});

// Create a new MouseEvent object with the appropriate type
const clickEvent = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
  view: window
});

// Event listener for the press of Enter key
document.addEventListener('keypress', (event) => {
    const field = document.getElementById('answer')
    if (event.key === 'Enter') {
        // Store the content of the input field inside an answer variable as an integer
        const answer_txt = field.value;
        const answer = parseInt(field.value);
        // If the input field is empty and the event is displayed, we show the description
        if (answer_txt == '' && positions[index] !== null) {
            showDescription(index);
        }
        // If there is a valid number in the input field and the event is not already in the timeline, we check the answer
        else if (!isNaN(answer) && positions[index] == null ) {
            const res = correct_interval(answer, index);
            // update the score of the current player
            if (res) {
                playerScores[player_ID-1]['nb-points']++;
                if (answer == parseInt(events[index]["Date"])) {
                    playerScores[player_ID-1]['nb-perfect']++;
                }
            }
            else {
                playerScores[player_ID-1]['nb-mistakes']++;
            }
            // Update number of points and mistakes
            document.getElementById('nb-points'+player_ID).innerHTML = playerScores[player_ID-1]['nb-points'];
            document.getElementById('nb-perfect'+player_ID).innerHTML = playerScores[player_ID-1]['nb-perfect'];
            document.getElementById('nb-mistakes'+player_ID).innerHTML = playerScores[player_ID-1]['nb-mistakes'];
            updatePlayerID()
            // Update the timeline, current event field and events array
            field.value = ''; // Clear the input field after processing the answer
            document.getElementById('current-event').innerHTML = "";
            const [x, y, move_id] = computePosition(index);
            addEventToTimeline(x, y, index);
            not_displayed.splice(not_displayed.indexOf(index), 1);
            document.getElementById('nb_events').innerHTML = `${not_displayed.length}`;
            updateEventPosition(move_id);
            // Show the description of the event
            showDescription(index);
            // Automatically click on the next-event button
            //document.getElementById('next-event-btn').dispatchEvent(clickEvent);
        }
    }
});

// Event listener for the help button
document.getElementById('help').addEventListener('click', showHelp);

// Event listener to hide the help popup when pressing the Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && helpPopup) {
        hideHelp()
    }
});
document.getElementById('helpPopup').addEventListener('mouseout',hideHelp);



