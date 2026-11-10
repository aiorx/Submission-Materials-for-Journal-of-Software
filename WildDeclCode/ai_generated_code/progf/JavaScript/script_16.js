var canvas = document.getElementById('myCanvas');
var clearBtn = document.getElementById('clearBtn')

var context = canvas.getContext("2d");
var isDrawing = false;

// Event listener for mouse down event
canvas.addEventListener("mousedown", startDrawing);

// Event listener for mouse move event
canvas.addEventListener("mousemove", draw);

// Event listener for mouse up and mouse leave events

canvas.addEventListener("mouseleave", stopDrawing);
canvas.addEventListener("mouseup", ()=>{
    stopDrawing();
    var img = new Image();
    img.onload = function() {
        context.drawImage(img, 0, 0, 28, 28);
        data = context.getImageData(0, 0, 28, 28).data;
        var input = [];
        for(var i = 0; i < data.length; i += 4) {
            input.push(data[i + 3] / 255);
        }
        var finalData = nj.reshape(input,[28, 28,1]);
        
        console.log(finalData); 
    };
    img.src = canvas.toDataURL('image/png');
    
});




  

clearBtn.addEventListener("click",()=>{
    context.clearRect(0, 0, canvas.width, canvas.height);
})

function startDrawing(e) {
    isDrawing = true;
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    context.lineWidth = 10;
    context.beginPath();
    context.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    context.lineTo(x, y);
    context.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

//Code Assisted with basic coding tools :)

tf.loadLayersModel('../model/model.json').then(model => {
    window.model = model;
}).catch(err=>console.log(err))
