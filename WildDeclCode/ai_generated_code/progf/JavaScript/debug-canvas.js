// Aided with basic GitHub coding tools
function createDebugCanvas(gridSpacing, color = "#ff0") {
    const webglCanvas = document.getElementById('webgl-canvas');
    if (!webglCanvas) {
        showError('webgl-canvas not found');
        return;
    }

    // Create the debug canvas
    let debugCanvas
    // Check if the debug canvas already exists
    if (document.getElementById('debug-canvas')) {
        // If it exists, get it
        debugCanvas = document.getElementById('debug-canvas');
    } else {
        debugCanvas = document.createElement('canvas');
        debugCanvas.id = 'debug-canvas';
        document.body.appendChild(debugCanvas);
    }
    
    const ctx = debugCanvas.getContext('2d');
    dpi = window.devicePixelRatio || 1; // Get the device pixel ratio
    const rect = webglCanvas.getBoundingClientRect();
    debugCanvas.width = rect.width; 
    debugCanvas.height = rect.height; 
    set_retina(debugCanvas);
    
    debugCanvas.style.position = 'absolute';
    debugCanvas.style.top = webglCanvas.offsetTop + 'px';
    debugCanvas.style.left = webglCanvas.offsetLeft + 'px';
    debugCanvas.style.pointerEvents = 'none'; // Allow clicks to pass through
    debugCanvas.style.zIndex = '10'; // Ensure it overlays the WebGL canvas
    
    
    // Clear the canvas
    ctx.clearRect(0, 0, debugCanvas.width, debugCanvas.height);
    
    ctx.strokeStyle = color; // Semi-transparent black
    ctx.lineWidth = 1;

    // Draw vertical lines
    ctx.beginPath();
    for (let x = 0; x <= debugCanvas.width; x += gridSpacing) {
        
        ctx.moveTo(x, 0);
        ctx.lineTo(x, debugCanvas.height);
        
    }
    // ctx.stroke();

    // Draw horizontal lines
    // ctx.beginPath();
    for (let y = 0; y <= debugCanvas.height; y += gridSpacing) {
        
        ctx.moveTo(0, y);
        ctx.lineTo(debugCanvas.width, y);
        
    }
    ctx.stroke();
}

// Call the function to create and overlay the debug canvas