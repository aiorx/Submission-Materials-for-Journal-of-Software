/**
 * @fileoverview  This file contains the functions for the interactions in the scene.
 * F.e. moving the camera, moving the curtains, registering instrument selection, etc.
 */
import { 
    getCello, 
    getCurtainRope, 
    getCurtainLeft, 
    getCurtainRight, 
    getTheaterRoom, 
    getTheaterChairs, 
    getInstrumentActivationPlane, 
    getPiano, 
    getVioline, 
    getPortalPlane, 
    getCanvasPlane,
    getPlankLeft,
    getPlankRight,
    getDragPlane,
    getLimitPlane,
    createInstrumentDragPlane,
    getInstrumentDragPlane
} from "./loaders.js";

import { 
    updateStatus, 
    addControlExplanation 
} from "./gui.js";

import { setupGui } from "./gui.js";

import { activateSpotlight, getSpotlight } from "./lights.js";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

//----Definint global variables----
let scene;
let camera;
let gl;
let cello;
let piano;
let violine;
let cord;
let instrumentActivationPlane;
let trackballControls;
let mouseMoveSituation = "";
let instrumentToMove = null;

let theaterRoom;
let theaterChairs;
let curtainLeft;
let curtainRight;
let curtainRope;
let portalPlane;
let canvasPlane;
let plankLeft;
let plankRight;
let dragPlane;
let limitPlane;
let instrumentDragPlane;
let spotLight;
let initCordYPos;

/**
 * Sets up the interactions for the scene.
 * 
 * @param inScene The scene to set up the interactions for.
 * @param inCamera The camera to set up interactions for/with.
 * @param inGl The WebGLRenderer to set up the interactions for/with.
 */
export async function setupInteractions(inScene, inCamera, inGl) {
    scene = inScene;
    camera = inCamera;
    gl = inGl;

    // Event listener for dragging the curtainrope
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    dragPlane = getDragPlane();
    limitPlane = getLimitPlane();
    cord = getCurtainRope();

    // Event Listener for moving the instruments
    window.addEventListener('click', onMouseClick);

    // Event Listener used for moving isntruments and dragging the cord
    window.addEventListener('mousemove', onMouseMove);

    // Initialising theaterRoom objects
    theaterRoom = getTheaterRoom();
    theaterChairs = getTheaterChairs();
    curtainLeft = getCurtainLeft();
    curtainRight = getCurtainRight();
    curtainRope = getCurtainRope();
    initCordYPos = curtainRope.position.y;

    // Initialising instrumentActivationPlane
    instrumentActivationPlane = getInstrumentActivationPlane();
    cello = getCello();
    piano = getPiano();
    violine = getVioline();

    // Initialising portalPlane
    portalPlane = getPortalPlane();
    canvasPlane = getCanvasPlane();

    // Initialising planks
    plankLeft = getPlankLeft();
    plankRight = getPlankRight();

    // Toggle the textoverlay and isnert the first message
    toggleOverlay(true);
    updateOverlayText('Pull the cord to start! Make sure to keep the mouse over the cord while dragging.');

}

//----Initialising global variables, first used in onMouseDown ----
let cordObject = null;
let previousCordWorldPointY = null;
let selectedObject = null;
let isDragging = false;

/**
 * Function to handle the mousedown event.
 * The function gets the mosue coordinates.
 * If an object is intersected by the raycaster, it saves the world y coordinate of the first intersected object.
 * This is later used to calculate the difference between the current and the previous world y coordinate of the rope/cord.
 * If the first interssected object ist the cord object, the object is saved in the cordObject variable.
 * The selectedObject variable is set to the first intersected object.
 * The isDragging variable is set to true.
 * The mouseMoveSituation variable is set to "cord", important for the {@link onMouseMove} function.
 * 
 * @param event The mousedown event.
 */
function onMouseDown(event) {
    console.log("onMouseDown called");
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);

    const allIntersectedObjects = raycaster.intersectObjects(scene.children, true);
    console.log("onMouseDown sagt: 'Objekte getroffen:", allIntersectedObjects, "'");
    if (allIntersectedObjects.length > 0) {
        const firstIntersectedObject = allIntersectedObjects[0].object;
        const worldPoint = allIntersectedObjects[0].point;
        previousCordWorldPointY = worldPoint.y;

        if (firstIntersectedObject.userData.isCord) {
            cordObject = firstIntersectedObject;
            selectedObject = firstIntersectedObject;
            isDragging = true;
            mouseMoveSituation = "cord";
        }
    }

}

/**
 * Function to get the x and y coordinates of the mouse.
 * This function has been Drafted using common GitHub development resources.
 * 
 * @param event The event to get the coordinates from.
 * @returns The mouse coordinates.
 */
function getMouseCoords(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    return mouse;
}

//----Initialising global variables, first used in onMouseMove----
let moveCurtains = false;
let moveCamera = false;
let worldCordYDifference = null;
let lastCordY = null;

let previousInstrumentWorldPointX = null;
let previousInstrumentWorldPointZ = null;
let instrumentsY = 2.5;

/**
 * Function to handle the mousemove event.
 * This is used for dragging the cord as well as dragging the instruments.
 * 
 * The function gets the mouse coordinates.
 * 
 * If the mouseMoveSituation is "cord", the function checks if the isDragging variable is true.
 * This is triggered by the {@link onMouseDown} function.
 * Otherwise the function returns.
 * If true, just like the {@link onMouseDown} function, the function uses a raycaster to get the cord object.
 * As long as the cord gets dragged and is the first intersected object, the function calculates the difference
 * between the current and the previous world y coordinate of the cord.
 * The cord object gets moved by the difference.
 * 
 * When the dragPlane ist reached and becomes the first intersected object:
 * - the overlay text gets removed
 * - the spotlight gets activated
 * - {@link startMovements} is called to start curtain and camera movements after two seconds
 * 
 * If the mouseMoveSituation is "instrument", the function uses a raycaster to get the intersected objects.
 * This is triggered by the {@link onMouseClick} function.
 * {@link onMouseClick} already established, that the object is one of the isntruments.
 * The function moves the instrument to where the raycaster currently intersects the first intersected object
 * behind the instrument, which is the instrumentDragPlane.
 * 
 * @param event The mousemove event.
 */
function onMouseMove(event) {
    const mouseCoords = getMouseCoords(event);
    if(mouseMoveSituation == "cord") {
        if (!isDragging) {
            return;
        }
    
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
    
        raycaster.setFromCamera(mouse, camera);
    
        const allIntersectedObjects = raycaster.intersectObjects(scene.children);
    
        if (allIntersectedObjects.length > 0) {
            const firstIntersectedObject = allIntersectedObjects[0].object; 
            const worldPoint = allIntersectedObjects[0].point;
            if (firstIntersectedObject.userData.isCord) {
                let wordlPointY = worldPoint.y;
                worldCordYDifference = wordlPointY - previousCordWorldPointY;
                firstIntersectedObject.position.y += worldCordYDifference;
                lastCordY = firstIntersectedObject.position.y;
                previousCordWorldPointY = wordlPointY;
            }
            if (firstIntersectedObject.name === "dragPlane" && allIntersectedObjects[1].object.name === "cord") {
                updateOverlayText(''); // Remove overlay text
                activateSpotlight(scene, instrumentActivationPlane);
                spotLight = getSpotlight(); // Init spotlight variable
                setTimeout(startMovements(), 2000);
            }
        }
    } else if(mouseMoveSituation == "instrument") {
        raycaster.setFromCamera(mouseCoords, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if(intersects.length > 0) {
            const intersect = intersects[0];
            const worldPoint = intersect.point;

            //Has to be done individually because .position is read only somehow
            instrumentToMove.position.x = worldPoint.x;
            instrumentToMove.position.y = instrumentsY;
            instrumentToMove.position.z = worldPoint.z;

            previousInstrumentWorldPointX = worldPoint.x;
            previousInstrumentWorldPointZ = worldPoint.z;
        }
    }
    
    
}

// Funktion zum Stoppen der Kordelbewegung
/**
 * Function to handle the mouseup event.
 * This function stops the dragging of the cord.
 * If the cord was dragged, the cord gets reset to its initial y position.
 * Does nothing when not dragging or no object selected
 * 
 * @param event The mouseup event.
 */
function onMouseUp(event) {
    if (!isDragging || !selectedObject) return; 

    if (initCordYPos != cordObject.position.y) {
        mouseMoveSituation = "";    // Clear the mouseMoveSituation
        cordObject.position.y = initCordYPos;
    }

    // Stop movement of the cord
    isDragging = false;
    selectedObject = null;
}

let amountOfClicks = 0;
/**
 * Function to handle the mouseclick event.
 * This function is used to select the instruments.
 * The function only works, if the theaterroom is hidden.
 * The function counts the amount of clicks as a way of ensuring that:
 * - the first click is instrument selection 
 * - the second click is the one to let go of the instrument
 * 
 * The function uses a raycaster to get the intersected instrument.
 * If an instrument is intersected, the function creates a dragplane for the instrument to be dragged along.
 * The dragplane ist created temporalily after instrument selecetion, to stop it from interfering when trying 
 * to select an isntrument from underneath the dragplane.
 * When the instrument is let go, so amountOfClicks != 1, the dragplane gets removed.
 * 
 * @param event The mouseclick event.
 */ 
function onMouseClick(event) {
    if(theaterRoomHidden) {
        amountOfClicks++;
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
    
        raycaster.setFromCamera(mouse, camera);
        if(amountOfClicks == 1) {
            const allIntersectedObjects = raycaster.intersectObjects(scene.children, true);
            if (allIntersectedObjects.length > 0) {
                const firstIntersectedObject = allIntersectedObjects[0].object;
                if (firstIntersectedObject.userData.selectable) {
                    createInstrumentDragPlane(scene);
                    instrumentToMove = firstIntersectedObject;
                    previousInstrumentWorldPointX = instrumentToMove.position.x;
                    previousInstrumentWorldPointZ = instrumentToMove.position.y;
                    mouseMoveSituation = "instrument";
                } else {
                    amountOfClicks = 0;
                }
            }
        } else {
            // Let go of instrument
            instrumentDragPlane = getInstrumentDragPlane();
            removeObjectFromScene(instrumentDragPlane);
            mouseMoveSituation = "";
            amountOfClicks = 0;
        }
    }
}

/**
 * Function to start the movements of the curtains and the camera.
 * The function sets the moveCurtains variable to true, to start the curtain movement.
 * The function sets a timeout of 5 seconds to start the camera movement.
 * The function is called by the {@link onMouseMove} function, when the dragplane is reached.
 */
function startMovements() {
    moveCurtains = true;  // Starte die Vorhangbewegung sofort
    
    // Verzögere die Kamerabewegung um 5 Sekunden
    setTimeout(function() {
        moveCamera = true;  // Starte die Kamerabewegung nach 5 Sekunden
    }, 5000);
}

//----Global variables for curtain and camera movement----
let curtainMovementSpeed = 0.03;
let curtainRightEndPosition = 62;
let curtainLeftEndPosition = -28;
var cameraInFinalPosition = false;

/**
 * Function to move the curtains.
 * The function is continously called by the draw() function inside the {@link render} file.
 * This should initially allow a smooth movement of the curtains.
 * Would propably be done different now.
 * 
 * The funtion only moves the curtains, if the moveCurtains variable is true.
 * {@link startMovements} sets the moveCurtains variable to true.
 * 
 * The function gets the current position of the left and right curtain.
 * The function checks if the curtains are not at their end position.
 * If the curtains are not at their end position, the function moves the curtains by the curtainMovementSpeed.
 */
export async function moveCurtainsFunction() {
    var curtainLeft = await getCurtainLeft();
    var curtainRight = getCurtainRight();
    if (!moveCurtains) return;
    
    if (curtainRight.position.x < curtainRightEndPosition && curtainLeft.position.x > curtainLeftEndPosition) {
        curtainRight.position.x += curtainMovementSpeed;
        curtainLeft.position.x -= curtainMovementSpeed;
    } 
}

//----Global variables for camera movement----
let cameraMovementSpeed = 0.2;
let cameraEndPosition = 45;
let theaterRoomHidden = false;

/**
 * Function to move the camera forward.
 * The function is continously called by the draw() function inside the {@link render} file.
 * This should initially allow a smooth movement of the camera.
 * Would propably be done different now.
 * 
 * The funtion only moves the camera, if the moveCamera variable is true.
 * {@link startMovements} sets the moveCamera variable to true.
 * 
 * The function gets the current position of the camera.
 * The function checks if the camera is not at its end position.
 * If the camera is not at its end position, the function moves the camera by the cameraMovementSpeed.
 * 
 * If the camera reached its end position and the theater room is still visible the function calls
 * the {@link hideTheaterroom} function to hide the theater room.
 * 
 * If the camera reached its end position, the function stops the camera movement and the curtain movement.
 * The function sets the {@link moveCamera} and {@link moveCurtains} variables to false.
 * The function sets the {@link cameraInFinalPosition} variable to true.
 * The function calls the {@link panCameraToZero} function to pan the camera to zero.
 * The function calls the {@link setupGui} function in the gui.js to set up the gui.
 * 
 * When the camera is panned to zero, the function calls the {@link enableCameraMovement} function to enable the camera movement.
 */
export async function moveCameraForward() {
    if(cameraInFinalPosition && !theaterRoomHidden) {
        hideTheaterroom();
    }

    if (!moveCamera) return;
    
    if (camera.position.z > cameraEndPosition) {
        camera.position.z -= cameraMovementSpeed;
    } else {
        moveCamera = false;  
        moveCurtains = false;
        cameraInFinalPosition = true;
        panCameraToZero();
        setupGui();
        if(cameraPanned) {
            setTimeout(() => {
                enableCameraMovement();
            },2000);
        }
    }
}

//----Global variable for camera panning----
let cameraPanned = false;
/**
 * Function to pan the camera to the zero coordinates.
 * This was nessesary, as {@link initTrackballControls} for some reasons automaticals rotates the camera to this angle.
 * This would cause an abrupt pan, when trackballcontrols got activated.
 * This functions places the pan at the end of the camera movement, which makes it not noticable.
 * The function only pans the camera, if the camera is in its final position and the camera is not already panned.
 * Then sets the {@link cameraPanned} variable to true.
 */ 
export function panCameraToZero() {
    if(cameraInFinalPosition && !cameraPanned) {
        let angleToAchieve =-0.38050637711236873;
        camera.rotation.x = angleToAchieve;
        cameraPanned = true; 
    }
}

/**
 * Function to remove an object from the scene.
 * This function was proposed by Copilot.
 * 
 * It removes the object from its parent, if the object exists and has a parent.
 * 
 * @param object The object to remove from the scene.
 */
function removeObjectFromScene(object) {
    if (object && object.parent) {
        object.parent.remove(object);
    }
}

/**
 * Function to hide the theater room.
 * The function removes all objects that are part of the theater room.
 * The function sets the {@link theaterRoomHidden} variable to true.
 */
function hideTheaterroom() {
    removeObjectFromScene(theaterRoom);
    removeObjectFromScene(theaterChairs);
    removeObjectFromScene(curtainLeft);
    removeObjectFromScene(curtainRight);
    removeObjectFromScene(curtainRope);
    removeObjectFromScene(spotLight);
    removeObjectFromScene(dragPlane);
    removeObjectFromScene(limitPlane);
    removeObjectFromScene(portalPlane);
    removeObjectFromScene(canvasPlane);
    removeObjectFromScene(plankLeft);
    removeObjectFromScene(plankRight);
    theaterRoomHidden = true;
}

/**
 * This function is used to rotate the portal plane on its z-axis and make the portal seem more dynamic.
 * The function is continously called by the draw() function inside the {@link render} file.
 */ 
export function rotatePortal() {
    portalPlane.rotation.z -= 0.01;
}

//----Enable camera control by mouse----
/**
 * Function to enable the camera movement.
 * The function initialises the trackball controls for the camera.
 * The function calls the {@link explainControls} function to explain the controls to the user, after camera movement is enabled.
 */ 
export function enableCameraMovement() {
    if(!trackballControls) {
        trackballControls = initTrackballControls(camera, gl);
        explainControls('all');
    }
    
}

//----Initialising global variable for the explainControls function----
let controlExplanationAdded = false;
/**
 * Function to explain the controls to the user.
 * 
 * The function is async, to allow the overlay text to be updated with a delay and not be removed
 * until the desired time is run down.
 * 
 * The function updates the overlay text with the {@link updateOverlayText} function.
 * 
 * The function explains the controls for the mouse, the music and the instruments.
 * 
 * The function can explain all controls at once or only the controls for the mouse, the music or the instruments,
 * depending in the {@link controlType} parameter.
 * 
 * The function adds the tutorial controls to the gui once, using {@link addControlExplanation}, if they have not been added yet.
 * This enables the function to be called again if the user needs to see parts of the tutorial again.
 * When the buttons for the Tutorial have been added, the function sets the {@link controlExplanationAdded} variable to true.
 * 
 * @param controlType The type of controls to explain. Can be 'mouse', 'music', 'instruments' or 'all'.
 */
export async function explainControls(controlType) {
    console.log("Explaining controls...");
    if(controlType == 'mouse' || controlType == 'all') {
        await updateOverlayText('You can now move the camera by clicking and dragging the mouse.', true, 4000);
        await updateOverlayText('You can also zoom in and out by scrolling the mouse wheel.', true, 4000);
    } 
    if(controlType == 'music' || controlType == 'all') {
        await updateOverlayText('Please enable your computers sound.', true, 4000);
        await updateOverlayText('You can start playing music by selecting the "Play Music" button in the upper right controls.', true, 5000);
        await updateOverlayText('If you wish to pause or stop the music entirely, you can do that with the "Pause Music" and "Stop Music" buttons in the upper right controls.', true, 6000);
    } 
    if(controlType == 'instruments' || controlType == 'all') {
        await updateOverlayText('If you want to mute an instrument, click on it once, move it off stage and click on it again. ', true, 5000);
        await updateOverlayText('To unmute the instrument, bring it back on stage by clicking on it, dragging it on stage and clicking on it again.', true, 6000);
        await updateOverlayText('Be patient, cello and violine only set in after some 15 seconds or so. :)', true, 4000);
    }
    await updateOverlayText('');
    if(!controlExplanationAdded) {
        addControlExplanation();
        controlExplanationAdded = true;
    }
}

/**
 * Getter for the trackball controls.
 * This function was taken from the last exercise we did.
 * @returns The trackball controls.
 */
export function getTrackBallControls() {
    return trackballControls;
}

/**
 * Updates the trackball controls.
 * This function was taken from the last exercise we did.
 * 
 * @param clockInput The clock input for the trackball controls.
 */
export function updateTrackBallControls(clockInput) {
    trackballControls.update(clockInput);
}

/**
 * Helper function to check if an instrument is within the activation plane.
 * 
 * The function calculates the distance between the object and the activation plane.
 * If the distance is smaller or equal to the radius of the activation plane, the function returns true.
 * Otherwise the function returns false.
 * 
 * @param object The object/instrument to check if it is within the activation plane.
 * @returns True if the object is within the activation plane, false otherwise.
 */
function isObjectWithinActivationPlane(object) {
    const planePosition = instrumentActivationPlane.position;
    const planeRadius = instrumentActivationPlane.geometry.parameters.radius;

    const distance = Math.sqrt(
        Math.pow(object.position.x - planePosition.x, 2) +
        Math.pow(object.position.z - planePosition.z, 2)
    );

    return distance <= planeRadius;
}

/**
 * Function to check if the instruments are within the activation plane.
 * The function calls the {@link isObjectWithinActivationPlane} helper function for each instrument.
 * The function updates the status of the instruments with the {@link updateStatus} function
 * from the gui.js file.
 * The function is continously called by the {@link render} file in the draw() function.
 * The function only checks the instruments, if the camera is in its final position.
 */
export function checkInstrumentsPosition() {
    if(cameraInFinalPosition) {
        if(isObjectWithinActivationPlane(cello)) {
            updateStatus('1', true);
        } else {
            updateStatus('1', false);
        }

        if(isObjectWithinActivationPlane(piano)) {
            updateStatus('2', true);
        } else {
            updateStatus('2', false);
        }

        if(isObjectWithinActivationPlane(violine)) {
            updateStatus('3', true);
        } else {
            updateStatus('3', false);
        }

    }

}

/**
 * Function to update the overlay text.
 * Updates the html element with the id 'overlay' with the given text.
 * 
 * @param text The text to update the overlay with.
 * @param delay If the overlay text should be delayed. Standard is false.
 * @param delaytime The time to delay the overlay text. Standard is 0.
 * @returns A promise to ensure, that the overlay text is updated and stays visible for the desired time.
 */
function updateOverlayText(text, delay=false, delaytime=0) {
    return new Promise((resolve, reject) => {
        try {
            const overlay = document.getElementById('overlay');
            if (overlay) {
                if(!delay) {
                    overlay.textContent = text;
                    resolve();
                } else if(delay){
                    overlay.textContent = text;
                    setTimeout(() => {
                        resolve();
                    }, delaytime);
                }
            } else {
                reject("Overlay element not found");
            }
        } catch (error) {
            console.error("Error in updateOverlayText:", error);
            reject(error);
        }
    });
}

/**
 * Function to toggle the overlay.
 * The function shows the html element with the id 'overlay' if the visible parameter is true by setting 
 * its display style to 'block'.
 * The function hides the html element with the id 'overlay' if the visible parameter is false by setting
 * its display style to 'none'.
 * @param visible If the overlay should be visible or not.
 */
function toggleOverlay(visible) {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = visible ? 'block' : 'none';
    }
}