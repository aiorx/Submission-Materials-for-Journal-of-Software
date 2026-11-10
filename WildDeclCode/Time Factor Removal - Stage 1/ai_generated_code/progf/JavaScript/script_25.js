// script.js
// comments Drafted using common development resources because i am lazy, so they probably make 0 sense lmao

// Constants
var CANVAS_SIZE = 512; // 512x512 canvases
var GAP_SIZE = 10; // Gap between canvases
var MIN_ZOOM = 0.2;
var MAX_ZOOM = 20;
var ZOOM_SENSITIVITY = 0.005;
var PAN_SPEED = 2;

// DOM Elements
var canvasMap = document.getElementById('canvas-map');
var pencilSizeDisplay = document.getElementById('pencil-size-display');
var pencilSizeSlider = document.getElementById('pencil-size-slider');
var toolButtons = document.querySelectorAll('.tool-button');
var colorArea = document.getElementById('color-palette');
var colorPalette = document.getElementById('color-swatches');
var clearColorsButton = document.getElementById('clear-colors');

// State Variables
var currentTool = 'pencil';
var currentColor = argbHexToRgba('ff000042'); // Default color
var pencilSize = 6;
var isDrawing = false;
var currentCanvasObj = null;
var isPanning = false;
var startPan = { x: 0, y: 0 };
var currentPan = { x: 0, y: 0 };
var currentZoom = 1;
var hoverTimeout = null;
var lastHoveredPixel = null;
var disableDrawing = false;
var canvases = new Map(); // key: 'x|y', value: { canvas, ctx, canvasData, rendered }

// Tool Classes

// Base Tool Class
class Tool {
    constructor(name) {
        this.name = name;
    }

    onMouseDown(e, canvasObj) {}
    onMouseMove(e, canvasObj) {}
    onMouseUp(e, canvasObj) {}
}

// Drawing Tool (Handles Pencil and Eraser)
class DrawingTool extends Tool {
    constructor(name, isEraser = false, extra_data = {}) {
        super(name);
        this.isEraser = isEraser;
        this.lastPosition = null;
        this.extra_data = {
            targetColor: null
        };
    }

    onMouseDown(e, canvasObj) {
        isDrawing = true;
        currentCanvasObj = canvasObj;
        var x = getCanvasCoordinates.x;
var y = getCanvasCoordinates.y;(e, canvasObj);
        this.lastPosition = { x, y };
        var drawColor = this.isEraser ? argbHexToRgba('ff000042') : currentColor;
        this.plotPoint(canvasObj, x, y, drawColor);
    }

    onMouseMove(e, canvasObj) {
        if (isDrawing && currentCanvasObj) {
            this.draw(e, currentCanvasObj);
        }
    }

    onMouseUp() {
        isDrawing = false;
        currentCanvasObj = null;
        this.lastPosition = null;
    }

    draw(e, canvasObj) {
        var x = getCanvasCoordinates.x;
var y = getCanvasCoordinates.y;(e, canvasObj);
        var drawColor = this.isEraser ? argbHexToRgba('ff000042') : currentColor;

        if (this.lastPosition && (this.lastPosition.x !== x || this.lastPosition.y !== y)) {
            this.interpolateLine(canvasObj, this.lastPosition.x, this.lastPosition.y, x, y, drawColor);
        }

        this.lastPosition = { x, y };
    }

    plotPoint(canvasObj, x, y, drawColor) {
        // Plot within current canvas
        var adjustedColor = this.isEraser ? argbHexToRgba('ff000042') : drawColor;
        drawPixel(canvasObj, x, y, adjustedColor);
    }

    interpolateLine(canvasObj, x1, y1, x2, y2, drawColor) {
        var distance = Math.hypot(x2 - x1, y2 - y1);
        var steps = Math.ceil(distance);

        for (var i = 0; i <= steps; i++) {
            var t = i / steps;
            var interpolatedX = Math.round(x1 + t * (x2 - x1));
            var interpolatedY = Math.round(y1 + t * (y2 - y1));

            this.plotPoint(canvasObj, interpolatedX, interpolatedY, drawColor);
        }
    }
}

class MarkerTool extends DrawingTool {
    constructor(name, isEraser = false, extra_data = {}) {
        super(name, isEraser, extra_data);
    }

    onMouseDown(e, canvasObj) {
        isDrawing = true;
        currentCanvasObj = canvasObj;
        var x = getCanvasCoordinates.x;
var y = getCanvasCoordinates.y;(e, canvasObj);
        this.lastPosition = { x, y };

        var targetColor = getPixelColor(canvasObj, x, y);
        this.extra_data.targetColor = targetColor;
        var drawColor = this.isEraser ? argbHexToRgba('ff000042') : currentColor;
        this.plotPoint(canvasObj, x, y, drawColor);
    }
}

// Color Picker Tool
class ColorPickerTool extends Tool {
    constructor(name) {
        super(name);
    }

    onMouseDown(e, canvasObj) {
        var x = getCanvasCoordinates.x;
var y = getCanvasCoordinates.y;(e, canvasObj);
        var color = getPixelColor(canvasObj, x, y);
        console.log(color);
        currentColor = color;
        updateColorSwatches(color);
    }
}

// Flood Fill Tool
class FloodFillTool extends Tool {
    constructor(name) {
        super(name);
    }

    onMouseDown(e, canvasObj) {
        var x = getCanvasCoordinates.x;
var y = getCanvasCoordinates.y;(e, canvasObj);
        var targetColor = getPixelColor(canvasObj, x, y);
        if (targetColor.toLowerCase() === currentColor.toLowerCase()) {
            return; // No need to fill if target color is the same as current color
        }
        floodFill(canvasObj, x, y, targetColor, currentColor);
        renderCanvas(canvasObj);
    }
}

// Rectangle Tool
class RectangleTool extends Tool {
    constructor(name) {
        super(name);
        this.startPos = null;
        this.isDrawing = false;
    }

    onMouseDown(e, canvasObj) {
        isDrawing = true;
        currentCanvasObj = canvasObj;
        var x = getCanvasCoordinates.x;
var y = getCanvasCoordinates.y;(e, canvasObj);
        this.startPos = { x, y };
        this.isDrawing = true;
    }

    onMouseMove(e, canvasObj) {
        if (!this.isDrawing || !currentCanvasObj) return;
        var x = getCanvasCoordinates.x;
var y = getCanvasCoordinates.y;(e, canvasObj);
        renderCanvasOverlay(canvasObj, this.startPos, { x, y });
    }

    onMouseUp(e, canvasObj) {
        if (!this.isDrawing || !currentCanvasObj) return;
        var x = getCanvasCoordinates.x;
var y = getCanvasCoordinates.y;(e, canvasObj);
        var { x: startX, y: startY } = this.startPos;
        drawRectangle(currentCanvasObj, startX, startY, x, y, currentColor);
        this.startPos = null;
        this.isDrawing = false;
        isDrawing = false;
        currentCanvasObj = null;
        clearCanvasOverlay();
    }
}

// Initialize Tools
var tools = {
    'pencil': new DrawingTool('pencil'),
    'rectangle': new RectangleTool('rectangle'),
    'flood-fill': new FloodFillTool('flood-fill'),
    'eraser': new DrawingTool('eraser', true),
    'color-picker': new ColorPickerTool('color-picker')
};

// Set default tool
currentTool = 'pencil';
document.getElementById('pencil-tool').classList.add('selected');

// Utility Functions

/**
 * Translates mouse or touch event to canvas coordinates.
 * @param {MouseEvent | TouchEvent} e - The event object.
 * @param {object} canvasObj - The canvas object.
 * @returns {object} - An object containing x and y coordinates.
 */
function getCanvasCoordinates(e, canvasObj) {
    var rect = canvasObj.canvas.getBoundingClientRect();
    var scaleX = canvasObj.canvas.width / rect.width;
    var scaleY = canvasObj.canvas.height / rect.height;

    if (e.touches && e.touches.length > 0) {
        var x = Math.floor((e.touches[0].clientX - rect.left) * scaleX);
        var y = Math.floor((e.touches[0].clientY - rect.top) * scaleY);
        return { x, y };
    } else {
        var x = Math.floor((e.clientX - rect.left) * scaleX);
        var y = Math.floor((e.clientY - rect.top) * scaleY);
        return { x, y };
    }
}

/**
 * Checks if the coordinates are within the canvas boundaries.
 * @param {number} x - X-coordinate
 * @param {number} y - Y-coordinate
 * @param {object} canvasObj - Canvas object
 * @returns {boolean}
 */
function isWithinCanvas(x, y, canvasObj) {
    return x >= 0 && x < canvasObj.canvas.width && y >= 0 && y < canvasObj.canvas.height;
}

/**
 * Wraps the coordinate if it goes beyond canvas boundaries.
 * @param {number} coord - Coordinate value
 * @param {number} max - Maximum value (width or height)
 * @returns {number}
 */
function wrapCoordinate(coord, max) {
    if (coord < 0) return max - 1;
    if (coord >= max) return 0;
    return coord;
}

/**
 * Determines the direction based on edge crossing.
 * @param {number} x - X-coordinate
 * @param {number} y - Y-coordinate
 * @param {object} canvasObj - Canvas object
 * @returns {string|null}
 */
function getDirectionFromEdge(x, y, canvasObj) {
    if (x < 0) return 'left';
    if (x >= canvasObj.canvas.width) return 'right';
    if (y < 0) return 'down';
    if (y >= canvasObj.canvas.height) return 'up';
    return null;
}

/**
 * Gets the neighbor canvas ID based on direction.
 * @param {string} currentId - Current canvas ID
 * @param {string} direction - Direction of the neighbor
 * @returns {string|null}
 */
function getNeighborCanvasId(currentId, direction) {
    var [x, y] = currentId.split('|').map(Number);
    switch(direction) {
        case 'left': return "" + (x - 1) + "|" + (y) + "";
        case 'right': return "" + (x + 1) + "|" + (y) + "";
        case 'up': return "" + (x) + "|" + (y + 1) + "";
        case 'down': return "" + (x) + "|" + (y - 1) + "";
        default: return null;
    }
}

/**
 * Draws a pixel or a brush based on the current brush size.
 * @param {object} canvasObj - Canvas object
 * @param {number} x - X-coordinate
 * @param {number} y - Y-coordinate
 * @param {string} color - Color to draw
 */
function drawPixel(canvasObj, x, y, color) {
    var ctx = canvasObj.ctx;
    ctx.fillStyle = color;
    ctx.imageSmoothingEnabled = false;

    drawBrush(ctx, x, y, Math.floor(pencilSize), color, canvasObj.id);
}

/**
 * Draws a circular brush with configurable pixel size, optimized by reducing the number of fillRect calls.
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X-coordinate
 * @param {number} y - Y-coordinate
 * @param {number} size - Radius of the brush
 * @param {string} color - Color to draw
 * @param {string} canvasId - ID of the canvas
 */
function drawBrush(ctx, x, y, size, color, canvasId) {
    var radius = size / 2;
    var center = radius - 0.5;
    var canvasObj = canvases.get(canvasId);
    if (!canvasObj) return;

    ctx.imageSmoothingEnabled = false;
    
    // Function to draw squares efficiently
    function drawSquare(x, y, width, height) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);

        var index = (y * CANVAS_SIZE) + x;

        if (canvasObj.canvasData === undefined) {
            canvasObj.canvasData = {};
            for (var i = 0; i < CANVAS_SIZE * CANVAS_SIZE; i++) {
                canvasObj.canvasData[i] = argbHexToRgba("ff000042");
            }
        }
        canvasObj.canvasData[index] = color;
    }

    // Loop over the brush area
    for (var yOffset = 0; yOffset < size; yOffset++) {
        for (var xOffset = 0; xOffset < size; xOffset++) {
            var distance = Math.sqrt(Math.pow(xOffset - center, 2) + Math.pow(yOffset - center, 2));
            if (distance < radius) {
                // Try to fill the largest possible square that fits in the circle

                // Determine the largest square that can be packed inside the current area
                var squareSize = 1;
                while (distance + squareSize - 1 < radius && xOffset + squareSize <= size && yOffset + squareSize <= size) {
                    squareSize++;
                }
                squareSize--; // Reduce to fit inside the circle

                // Draw the square
                drawSquare(x + xOffset - radius + 1, y + yOffset - radius + 1, squareSize, squareSize);

                // Skip the pixels that were filled by the square
                xOffset += squareSize - 1;
            }
        }
    }
}


/**
 * Renders a temporary overlay for the Rectangle tool to show the preview.
 * @param {object} canvasObj - Canvas object
 * @param {object} startPos - Starting position {x, y}
 * @param {object} currentPos - Current mouse position {x, y}
 */
function renderCanvasOverlay(canvasObj, startPos, currentPos) {
    // Create or get the overlay canvas
    var overlayCanvas = canvasObj.overlayCanvas;
    if (!overlayCanvas) {
        overlayCanvas = document.createElement('canvas');
        overlayCanvas.width = CANVAS_SIZE;
        overlayCanvas.height = CANVAS_SIZE;
        overlayCanvas.style.position = 'absolute';
        overlayCanvas.style.left = '0';
        overlayCanvas.style.top = '0';
        overlayCanvas.style.pointerEvents = 'none';
        overlayCanvas.style.zIndex = '10';
        canvasObj.wrapper.appendChild(overlayCanvas);
        canvasObj.overlayCanvas = overlayCanvas;
    }

    var ctx = overlayCanvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 2]);
    ctx.strokeRect(
        Math.min(startPos.x, currentPos.x),
        Math.min(startPos.y, currentPos.y),
        Math.abs(currentPos.x - startPos.x),
        Math.abs(currentPos.y - startPos.y)
    );
}

/**
 * Clears the overlay canvas used for previews (e.g., Rectangle tool).
 */
function clearCanvasOverlay() {
    canvases.forEach(function canvasObj {
        if (canvasObj.overlayCanvas) {
            canvasObj.overlayCanvas.getContext('2d').clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        }
    });
}

/**
 * Draws a filled rectangle on the canvas.
 * @param {object} canvasObj - Canvas object
 * @param {number} x1 - Starting X-coordinate
 * @param {number} y1 - Starting Y-coordinate
 * @param {number} x2 - Ending X-coordinate
 * @param {number} y2 - Ending Y-coordinate
 * @param {string} color - Fill color
 */
function drawRectangle(canvasObj, x1, y1, x2, y2, color) {
    var ctx = canvasObj.ctx;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = pencilSize;
    ctx.setLineDash([]);

    var startX = Math.min(x1, x2);
    var startY = Math.min(y1, y2);
    var width = Math.abs(x2 - x1) + 1;
    var height = Math.abs(y2 - y1) + 1;

    // Fill the rectangle
    for (var y = startY; y < startY + height; y++) {
        for (var x = startX; x < startX + width; x++) {
            if (isWithinCanvas(x, y, canvasObj)) {
                drawPixel(canvasObj, x, y, color);
            }
        }
    }
}

/**
 * Performs a flood fill algorithm starting from (x, y).
 * @param {object} canvasObj - Canvas object
 * @param {number} x - Starting X-coordinate
 * @param {number} y - Starting Y-coordinate
 * @param {string} targetColor - Color to replace
 * @param {string} replacementColor - New color
 */
function floodFill(canvasObj, x, y, targetColor, replacementColor) {

    console.log("Target: " + (targetColor) + ", Replacement: " + (replacementColor) + "");

    if (targetColor.toLowerCase() === replacementColor.toLowerCase()) return;

    var stack = [{ x, y }];
    var canvasSize = CANVAS_SIZE;

    while (stack.length) {
        var x = stack.pop.x;
var y = stack.pop.y;();

        if (x < 0 || x >= canvasSize || y < 0 || y >= canvasSize) continue;

        var currentColor = getPixelColor(canvasObj, x, y);
        if (currentColor.toLowerCase() !== targetColor.toLowerCase()) continue;

        var ctx = canvasObj.ctx;
        ctx.fillStyle = replacementColor;
        ctx.fillRect(x, y, 1, 1);

        // set color in canvasData
        var index = (y * CANVAS_SIZE) + x;
        canvasObj.canvasData[index] = replacementColor;

        stack.push({ x: x + 1, y });
        stack.push({ x: x - 1, y });
        stack.push({ x, y: y + 1 });
        stack.push({ x, y: y - 1 });
    }
}

function getPixelColor(canvasObj, x, y) {
    var key = (y * CANVAS_SIZE) + x;

    if (canvasObj.canvasData[key]) {
        return canvasObj.canvasData[key];
    } else {
        return argbHexToRgba("ff000042");
    }
}

/**
 * Updates the selected color swatch.
 * @param {string} color - Selected color
 */
function updateColorSwatches(color) {
    var swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(function swatch {
        swatch.classList.toggle('selected', swatch.getAttribute('data-color').toLowerCase() === color.toLowerCase());
    });
}

// Event Handlers

/**
 * Handles global mouse down events for drawing.
 * @param {MouseEvent} e 
 */
function handleMouseDown(e) {
    if (disableDrawing || e.button !== 0) return; // Only left-click

    if(e.target.closest == undefined) return;

    var targetCanvasWrapper = e.target.closest('.canvas-wrapper');
    if (!targetCanvasWrapper) return;

    var x = Number(targetCanvasWrapper.getAttribute('data-x'));
    var y = Number(targetCanvasWrapper.getAttribute('data-y'));
    var canvasId = "" + (x) + "|" + (y) + "";
    var canvasObj = canvases.get(canvasId);
    if (canvasObj) {
        var tool = tools[currentTool];
        tool?.onMouseDown(e, canvasObj);
    }
}

/**
* Handles global touch start events for drawing.
* @param {TouchEvent} e 
*/
function handleTouchStart(e) {
    if (disableDrawing) return;
    var targetCanvasWrapper = e.target.closest('.canvas-wrapper');
    if (!targetCanvasWrapper) return;

    var x = Number(targetCanvasWrapper.getAttribute('data-x'));
    var y = Number(targetCanvasWrapper.getAttribute('data-y'));
    var canvasId = "" + (x) + "|" + (y) + "";
    var canvasObj = canvases.get(canvasId);
    if (canvasObj) {
        var tool = tools[currentTool];
        tool?.onMouseDown(e, canvasObj);
    }
}

/**
 * Handles global mouse move events for drawing.
 * @param {MouseEvent} e 
 */
function handleMouseMove(e) {
    if (!isDrawing) return;

    // make sure e.target.closest is defined
    if(e.target.closest == undefined) return

    var targetCanvasWrapper = e.target.closest('.canvas-wrapper');
    if (!targetCanvasWrapper || !currentCanvasObj) return;

    var x = Number(targetCanvasWrapper.getAttribute('data-x'));
    var y = Number(targetCanvasWrapper.getAttribute('data-y'));
    var canvasId = "" + (x) + "|" + (y) + "";
    var canvasObj = canvases.get(canvasId);
    if (canvasObj) {

        // if canvasObj is not the same as currentCanvasObj, do onMouseUp on currentCanvasObj and onMouseDown on canvasObj
        if (canvasObj !== currentCanvasObj) {
            console.log("Mouse up on currentCanvasObj and mouse down on canvasObj");
            var tool = tools[currentTool];
            tool?.onMouseUp(e, currentCanvasObj);
            tool?.onMouseDown(e, canvasObj);
            currentCanvasObj = canvasObj;	
        }


        var tool = tools[currentTool];
        tool?.onMouseMove(e, canvasObj);
    }
}

/**
* Handles global touch move events for drawing.
* @param {TouchEvent} e 
*/
function handleTouchMove(e) {
    if (!isDrawing) return;
    var targetCanvasWrapper = e.target.closest('.canvas-wrapper');
    if (!targetCanvasWrapper || !currentCanvasObj) return;

    var x = Number(targetCanvasWrapper.getAttribute('data-x'));
    var y = Number(targetCanvasWrapper.getAttribute('data-y'));
    var canvasId = "" + (x) + "|" + (y) + "";
    var canvasObj = canvases.get(canvasId);
    if (canvasObj) {
        var tool = tools[currentTool];
        tool?.onMouseMove(e, canvasObj);
    }
}

/**
 * Handles global mouse up events for drawing.
 * @param {MouseEvent} e 
 */
function handleMouseUp(e) {
    if (!isDrawing) return;
    if(e.target.closest == undefined) return
    var targetCanvasWrapper = e.target.closest('.canvas-wrapper');
    if (!targetCanvasWrapper || !currentCanvasObj) {
        var tool = tools[currentTool];
        tool?.onMouseUp(e, null);
        return;
    }

    var x = Number(targetCanvasWrapper.getAttribute('data-x'));
    var y = Number(targetCanvasWrapper.getAttribute('data-y'));
    var canvasId = "" + (x) + "|" + (y) + "";
    var canvasObj = canvases.get(canvasId);
    if (canvasObj) {
        var tool = tools[currentTool];
        tool?.onMouseUp(e, canvasObj);
    }
}

/**
* Handles global touch end events for drawing.
* @param {TouchEvent} e
*/
function handleTouchEnd(e) {
    if (!isDrawing) return;
    var targetCanvasWrapper = e.target.closest('.canvas-wrapper');
    if (!targetCanvasWrapper || !currentCanvasObj) return;

    var x = Number(targetCanvasWrapper.getAttribute('data-x'));
    var y = Number(targetCanvasWrapper.getAttribute('data-y'));
    var canvasId = "" + (x) + "|" + (y) + "";
    var canvasObj = canvases.get(canvasId);
    if (canvasObj) {
        var tool = tools[currentTool];
        tool?.onMouseUp(e, canvasObj);
    }
}

// Global Event Listeners for Drawing
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);
// touch events
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', handleTouchEnd);

// Tool Selection Event Listeners
toolButtons.forEach(function button {
    button.addEventListener('click', () => {
        toolButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        currentTool = button.id.replace('-tool', '');
        clearCanvasOverlay(); // Clear any overlays when switching tools
    });
});

// Color Selection Event Listeners
colorPalette.addEventListener('click', function (e) {
    var swatch = e.target.closest('.color-swatch');
    if (swatch) {
        var selectedColor = swatch.getAttribute('data-color');
        currentColor = selectedColor;
        updateColorSwatches(selectedColor);
    }
});

/**
 * Updates the color swatches to reflect the selected color.
 * @param {string} color 
 */
function updateColorSwatches(color) {
    var swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(function swatch {
        swatch.classList.toggle('selected', swatch.getAttribute('data-color').toLowerCase() === color.toLowerCase());
    });
}

// Pencil Size Slider Event Listener
pencilSizeSlider.addEventListener('input', function (e) {
    pencilSize = parseInt(e.target.value, 10);
    pencilSizeDisplay.textContent = pencilSize;
});

// Canvas Visibility and Management

/**
 * Checks if a canvas is visible within the current viewport.
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean}
 */
function isCanvasVisible(x, y) {
    var canvasSize = CANVAS_SIZE;
    var gap = GAP_SIZE;
    var panX = currentPan.x;
    var panY = currentPan.y;
    var zoom = currentZoom;

    var canvasX = x * (canvasSize + gap) * zoom + panX;
    var canvasY = -y * (canvasSize + gap) * zoom + panY;

    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;
    var viewportWidthHalf = viewportWidth / 2;
    var viewportHeightHalf = viewportHeight / 2;

    canvasX += viewportWidthHalf;
    canvasY += viewportHeightHalf;

    var canvasWidth = canvasSize * zoom;
    var canvasHeight = canvasSize * zoom;

    return !(canvasX + canvasWidth < 0 || canvasX > viewportWidth || canvasY + canvasHeight < 0 || canvasY > viewportHeight);
}

/**
 * Updates the visibility of canvases based on their position.
 */
function updateVisibleCanvases() {
    canvases.forEach(function (canvasObj, canvasId) {
        var [x, y] = canvasId.split('|').map(Number);
        var wrapper = document.querySelector('.canvas-wrapper[data-x="' + (x) + '"][data-y="' + (y) + '"]');

        if (isCanvasVisible(x, y)) {
            if (!canvasObj.rendered) {
                wrapper.style.display = 'block';
                canvasObj.rendered = true;
            }
        } else {
            if (canvasObj.rendered) {
                wrapper.style.display = 'none';
                canvasObj.rendered = false;
            }
        }
    });
}

/**
 * Positions a canvas wrapper based on its coordinates.
 * @param {HTMLElement} wrapper 
 * @param {number} x 
 * @param {number} y 
 */
function positionCanvas(wrapper, x, y) {
    wrapper.style.left = "" + (x * (CANVAS_SIZE + GAP_SIZE)) + "px";
    wrapper.style.top = "" + (-y * (CANVAS_SIZE + GAP_SIZE)) + "px";
}

/**
 * Renders the canvas based on `canvasData`.
 * @param {object} canvasObj - Canvas object
 */
function renderCanvas(canvasObj) {
    var ctx = canvasObj.ctx;
	// ctx color
	ctx.fillStyle = argbHexToRgba("ff000042");
	ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    for (var y = 0; y < CANVAS_SIZE; y++) {
        for (var x = 0; x < CANVAS_SIZE; x++) {
            var color = getPixelColor(canvasObj, x, y);
            if (color !== argbHexToRgba('ff000042')) { // Assuming white is the default/empty color
                ctx.fillStyle = color;
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }
}


/**
 * Creates a new canvas wrapper at specified coordinates.
 * @param {number} x 
 * @param {number} y 
 * @param {boolean} alreadyLoaded 
 */
function createCanvasWrapper(x, y, dir = null) {
    var canvasId = generateCanvasId(x, y);

    if (canvases.has(canvasId) && !alreadyLoaded) {
        return;
    }

    var wrapper = document.createElement('div');
    wrapper.classList.add('canvas-wrapper');
    wrapper.setAttribute('data-x', x);
    wrapper.setAttribute('data-y', y);
    positionCanvas(wrapper, x, y);

    var canvas = document.createElement('canvas');
    canvas.classList.add('canvas');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    wrapper.appendChild(canvas);

	var inverseDir = null;
	if (dir != null) {
		switch(dir) {
			case 'up': inverseDir = 'down'; break;
			case 'down': inverseDir = 'up'; break;
			case 'left': inverseDir = 'right'; break;
			case 'right': inverseDir = 'left'; break;
		}
	}

    // Add arrow buttons for adding neighboring canvases
    ['up', 'down', 'left', 'right'].forEach(function direction {
		if (inverseDir == direction) return;
        var arrow = document.createElement('button');
        arrow.classList.add('arrow', direction);
        arrow.title = "Add Canvas " + (capitalize(direction)) + "";
        arrow.innerHTML = '<i class="fas fa-arrow-' + (direction) + '"></i>';
        arrow.addEventListener('click', () => handleArrowClick(x, y, direction));
        wrapper.appendChild(arrow);
    });

    canvasMap.appendChild(wrapper);

    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    var canvasObj = {
        id: canvasId,
        x,
        y,
        canvas,
        ctx,
        wrapper, // Added reference to the wrapper
        canvasData: {},
        rendered: true
    };

	// set canvas to black
	for (var i = 0; i < CANVAS_SIZE * CANVAS_SIZE; i++) {
		canvasObj.canvasData[i] = argbHexToRgba("ff000042");
	}
	ctx.fillStyle = argbHexToRgba("ff000042");
	ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    canvases.set(canvasId, canvasObj);

    updateArrowsVisibility(x, y);
}

/**
 * Handles arrow button clicks to add neighboring canvases.
 * @param {number} currentX 
 * @param {number} currentY 
 * @param {string} direction 
 */
function handleArrowClick(currentX, currentY, direction) {
    var newX = currentX;
    var newY = currentY;

    switch(direction) {
        case 'up': newY += 1; break;
        case 'down': newY -= 1; break;
        case 'left': newX -= 1; break;
        case 'right': newX += 1; break;
        default: return;
    }

    var newCanvasId = generateCanvasId(newX, newY);
    if (canvases.has(newCanvasId)) {
        alert('Canvas already exists in this direction.');
        return;
    }

	// disable arrow on current canvas
	var currentCanvasObj = canvases.get("" + (currentX) + "|" + (currentY) + "");
	var currentWrapper = currentCanvasObj.wrapper;
	var currentArrow = currentWrapper.querySelector(".arrow." + (direction) + "");
	currentArrow.style.display = 'none';

    createCanvasWrapper(newX, newY, direction);
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} str 
 * @returns {string}
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a canvas ID based on coordinates.
 * @param {number} x 
 * @param {number} y 
 * @returns {string}
 */
function generateCanvasId(x, y) {
    return "" + (x) + "|" + (y) + "";
}

/**
 * Updates the visibility of arrow buttons based on neighboring canvases.
 * @param {number} x 
 * @param {number} y 
 */
function updateArrowsVisibility(x, y) {
    var directions = ['up', 'down', 'left', 'right'];
    directions.forEach(function direction {
        var neighborId = getNeighborCanvasId(generateCanvasId(x, y), direction);
        var wrapper = document.querySelector('.canvas-wrapper[data-x="' + (x) + '"][data-y="' + (y) + '"]');
        var arrow = wrapper?.querySelector(".arrow." + (direction) + "");
        if (arrow) {
            arrow.style.display = canvases.has(neighborId) ? 'none' : 'block';
        }
    });
}

// Pan and Zoom Handling

/**
 * Initializes pan and zoom functionalities.
 */
function initPanAndZoom() {
    var isMouseDownPan = false;
    var lastMousePosition = { x: 0, y: 0 };
    var keysPressed = {};
    var isSpacePressed = false;

    // Mouse Event Listeners for Panning with Middle Button and Space + Drag
    document.addEventListener('mousedown', function (e) {
        if (e.button === 1 || (e.button === 0 && isSpacePressed)) { // Middle button or Space + Left Click
            e.preventDefault();
            console.log("Panning");
            isPanning = true;
            isMouseDownPan = true;
            disableDrawing = true;
            lastMousePosition = { x: e.clientX, y: e.clientY };
            canvasMap.classList.add('grabbing');
        }

    });

    document.addEventListener('mousemove', function (e) {
        if (isPanning && isMouseDownPan){
            var deltaX = e.clientX - lastMousePosition.x;
            var deltaY = e.clientY - lastMousePosition.y;
            pan(deltaX, deltaY);
        }
        lastMousePosition = { x: e.clientX, y: e.clientY };
    });

    document.addEventListener('mouseup', function (e) {
        if ((isPanning && e.button === 1) || (isPanning && e.button === 0 && isSpacePressed)) { // Middle button release or Space + Left Click release
            isPanning = false;
            isMouseDownPan = false;
            disableDrawing = false;
            canvasMap.classList.remove('grabbing');
        }
    });

    // Allow simulating touch events by pinning a point with alt and then dragging

    document.addEventListener('touchstart', touchStart);

    function touchStart (e) {
        if (e.touches.length === 2) {
            var touch1 = e.touches[0];
            var touch2 = e.touches[1];
            var touchCenter = {
                x: (touch1.clientX + touch2.clientX) / 2,
                y: (touch1.clientY + touch2.clientY) / 2
            };
            lastMousePosition = { x: touchCenter.x, y: touchCenter.y };
        }
    }

    var lastPinchDistance = -1;

    document.addEventListener('touchmove', touchMove);



    function touchMove (e) {
        console.log(e.touches.length)
        if (e.touches.length === 2) {
            console.log("Panning");
            var touch1 = e.touches[0];
            var touch2 = e.touches[1];
            var touchCenter = {
                x: (touch1.clientX + touch2.clientX) / 2,
                y: (touch1.clientY + touch2.clientY) / 2
            };
            var deltaX = touchCenter.x - lastMousePosition.x;
            var deltaY = touchCenter.y - lastMousePosition.y;
            pan(deltaX, deltaY);
            lastMousePosition = { x: touchCenter.x, y: touchCenter.y };

            var distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            if (lastPinchDistance === -1) {
                lastPinchDistance = distance;
            }

            var pinchChange = distance - lastPinchDistance;
            // zoom on the center of the pinch, make sure we zoom faster if the pinch distance is larger
            var rect = canvasMap.getBoundingClientRect();
            var mouseX = touchCenter.x - rect.left;
            var mouseY = touchCenter.y - rect.top;
            var scaleFactor = 0.005; // Control zoom speed here
            var wheel = pinchChange

            // Apply exponential scaling for smoother zoom
            var newZoom = currentZoom * (1 + wheel * scaleFactor);

            // Keep zoom within bounds
            newZoom = Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);
            var zoomChange = newZoom / currentZoom;

            // Adjust panning to keep the mouse position in the same place
            currentPan.x -= mouseX * (zoomChange - 1);
            currentPan.y -= mouseY * (zoomChange - 1);

            currentZoom = newZoom;

            

            updateCanvasMapTransform();

            lastPinchDistance = distance;

        }
    }

    document.addEventListener('touchend', touchEnd);

    function touchEnd (e) {
        if (e.touches.length < 2) {
            isPanning = false;
            pinnedPoint = null;
            lastPinchDistance = -1;
        }
    }


    // Keyboard Event Listeners for Panning with WASD and Arrow Keys
    document.addEventListener('keydown', function (e) {
        if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            keysPressed[e.key] = true;
        }
        if (e.code === 'Space') {
            e.preventDefault();
            disableDrawing = true;
            canvasMap.classList.add('grabbing');
            isSpacePressed = true;
        }
    });

    document.addEventListener('keyup', function (e) {
        if (keysPressed[e.key]) {
            keysPressed[e.key] = false;
        }
        if (e.code === 'Space') {
            disableDrawing = false;
            canvasMap.classList.remove('grabbing');
            isSpacePressed = false;
        }
    });

    // Mouse Wheel for Zooming
    document.addEventListener('wheel', function (e) {

        e.preventDefault();
        var rect = canvasMap.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
    
        var scaleFactor = 0.1; // Control zoom speed here
        var wheelDir = e.deltaY < 0 ? 1 : -1;
        
        // Apply exponential scaling for smoother zoom
        var newZoom = currentZoom * (1 + wheelDir * scaleFactor);
    
        // Keep zoom within bounds
        newZoom = Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);
        var zoomChange = newZoom / currentZoom;
    
        // Adjust panning to keep the mouse position in the same place
        currentPan.x -= mouseX * (zoomChange - 1);
        currentPan.y -= mouseY * (zoomChange - 1);
    
        currentZoom = newZoom;
        updateCanvasMapTransform();

    }, { passive: false });

    // Smooth Panning with Keyboard
    function smoothPan() {
        if (keysPressed['w'] || keysPressed['ArrowUp']) pan(0, PAN_SPEED);
        if (keysPressed['s'] || keysPressed['ArrowDown']) pan(0, -PAN_SPEED);
        if (keysPressed['a'] || keysPressed['ArrowLeft']) pan(PAN_SPEED, 0);
        if (keysPressed['d'] || keysPressed['ArrowRight']) pan(-PAN_SPEED, 0);
        requestAnimationFrame(smoothPan);
    }
    
    smoothPan();

    /**
     * Pans the canvas map by the specified deltas.
     * @param {number} deltaX 
     * @param {number} deltaY 
     */
    function pan(deltaX, deltaY) {
        currentPan.x += deltaX;
        currentPan.y += deltaY;
        updateCanvasMapTransform();
    }

}

/**
 * Updates the transformation of the canvas map based on pan and zoom.
 */
function updateCanvasMapTransform() {
    canvasMap.style.transform = "translate(" + (currentPan.x) + "px, " + (currentPan.y) + "px) scale(" + (currentZoom) + ")";
    updateVisibleCanvases();
}

// Canvas Management

/**
 * Initializes the canvas map on page load.
 */
window.onload = function () {
    // Prevent native pinch-to-zoom and other default behaviors
    ['gesturestart', 'gesturechange', 'gestureend', 'touchmove', 'dblclick'].forEach(event => {
        document.addEventListener(event, (e) => e.preventDefault(), { passive: false });
    });

    // Initialize pan and zoom functionalities
    initPanAndZoom();

    createCanvasWrapper(0, 0);

    // Load and parse the materials.xml to generate color swatches
    // Removed initial loadMaterialsXML to rely solely on drag-and-drop
};

/**
 * Prevent Ctrl + Zoom on Desktop
 */
window.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].includes(e.key)) {
        e.preventDefault();
    }
});

/**
 * Loads the materials.xml file and generates color swatches.
 * Modified to allow multiple files and to handle drag-and-drop.
 * @param {File} file - The XML file to load.
 */
function loadMaterialsXMLFile(file) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(event.target.result, "text/xml");
        var materials = xmlDoc.getElementsByTagName('CellData');
        var childMaterials = xmlDoc.getElementsByTagName('CellDataChild');
        var allMaterials = Array.from(materials).concat(Array.from(childMaterials));

        allMaterials.forEach(function material {
            var name = material.getAttribute('name');
            var wangColor = material.getAttribute('wang_color');

            if (name && wangColor) {
                createColorSwatch(wangColor, name);
            }
        });
    };
    reader.onerror = function() {
        console.error('Error reading file:', file.name);
    };
    reader.readAsText(file);
}

function argbHexToRgba(argbHex) {
	var hex = argbHex.replace('#', '');
	var alpha = parseInt(hex.slice(0, 2), 16) / 255;
	var rgbHex = hex.slice(2);
	return "rgba(" + (parseInt(rgbHex.slice(0, 2), 16)) + ", " + (parseInt(rgbHex.slice(2, 4), 16)) + ", " + (parseInt(rgbHex.slice(4), 16)) + ", " + (alpha) + ")";
}

createColorSwatch("FF000000", "none");

/**
 * Creates a color swatch with the given color and name.
 * @param {string} color - HEX color string
 * @param {string} name - Name of the material
 */
function createColorSwatch(color, name) {
    // Check for duplicate swatches
    var existingSwatch = Array.from(document.querySelectorAll('.color-swatch-container')).find(function container {
        var label = container.querySelector('.color-label');
        return label && label.textContent === name && container.querySelector('.color-swatch').getAttribute('data-color').toLowerCase() === color.toLowerCase();
    });
    if (existingSwatch) return; // Skip duplicates

    var swatchContainer = document.createElement('div');
    swatchContainer.classList.add('color-swatch-container');

    var swatch = document.createElement('div');
    swatch.classList.add('color-swatch');
    swatch.setAttribute('data-color', argbHexToRgba(color));
    swatch.style.backgroundColor = argbHexToRgba(color);

    var label = document.createElement('span');
    label.classList.add('color-label');
    label.textContent = name;

    swatchContainer.appendChild(swatch);
    swatchContainer.appendChild(label);

    colorPalette.appendChild(swatchContainer);
}

/**
 * Draws a pixel or a brush based on the current brush size.
 * @param {object} canvasObj - Canvas object
 * @param {number} x - X-coordinate
 * @param {number} y - Y-coordinate
 * @param {string} color - Color to draw
 */
function drawPixel(canvasObj, x, y, color) {
    var ctx = canvasObj.ctx;
    ctx.fillStyle = color;
    ctx.imageSmoothingEnabled = false;

    drawBrush(ctx, x, y, Math.floor(pencilSize), color, canvasObj.id);
}

// Drag and Drop Functionality

/**
 * Initializes drag and drop event listeners on the drop zone.
 */
function initDragAndDrop() {
    // Prevent default behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function eventName {
        colorArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop zone when item is dragged over
    ['dragenter', 'dragover'].forEach(function eventName {
        colorArea.addEventListener(eventName, () => colorArea.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(function eventName {
        colorArea.addEventListener(eventName, () => colorArea.classList.remove('dragover'), false);
    });

    // Handle dropped files
    colorArea.addEventListener('drop', handleDrop, false);
}

/**
 * Handles the drop event by loading each dropped XML file.
 * @param {DragEvent} e 
 */
function handleDrop(e) {
    var dt = e.dataTransfer;
    var files = dt.files;

    Array.from(files).forEach(function file {
        if (file.type === "text/xml" || file.name.endsWith(".xml")) {
            loadMaterialsXMLFile(file);
        } else {
            console.warn("Unsupported file type: " + (file.name) + "");
        }
    });
}

/**
 * Clears all loaded color swatches.
 */
function clearLoadedColors() {
    // Remove all swatch containers except the drop zone and clear button
    var swatchContainers = document.querySelectorAll('.color-swatch-container');
    swatchContainers.forEach(function container { return container.remove(); });
	createColorSwatch("FF000000", "none");
}

// Initialize Drag and Drop
initDragAndDrop();

// Clear Colors Button Event Listener
clearColorsButton.addEventListener('click', function () {
    clearLoadedColors();
});

// Canvas Management

/**
 * Initializes the canvas map on page load.
 */
window.onload = function () {
    // Prevent native pinch-to-zoom and other default behaviors
    ['gesturestart', 'gesturechange', 'gestureend', 'touchmove', 'dblclick'].forEach(event => {
        document.addEventListener(event, (e) => e.preventDefault(), { passive: false });
    });

    // Initialize pan and zoom functionalities
    initPanAndZoom();

    createCanvasWrapper(0, 0);

    // Note: Removed initial loadMaterialsXML to rely solely on drag-and-drop
};

/**
 * Prevent Ctrl + Zoom on Desktop
 */
window.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].includes(e.key)) {
        e.preventDefault();
    }
});
