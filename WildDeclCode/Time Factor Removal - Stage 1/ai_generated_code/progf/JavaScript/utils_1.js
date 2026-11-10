//Connect to socket
var socket = io.connect();


//Alert command
socket.on("alert", alert);


//Server closed
socket.on("closed", function (data) {
    socket.disconnect();
    document.getElementById("body").remove();
    var label = document.createElement("label");
    label.innerHTML = data;
    document.body.appendChild(label)
});


//Check if file exists
function fileExists(url) {
    try {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return (http.status != 404);
    } catch(err) {
        return false;
    }
}


//Generate number between given range
function randomRange(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}


//Resize avatar on client side - Aided using common development resources
function resizeImage(arrayBuffer, width, height) {
    return new Promise(function (resolve, reject) {
        var blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
        var image = new Image();
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        image.src = URL.createObjectURL(blob);

        image.onload = () => {
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(image, 0, 0, width, height);

            canvas.toBlob((newBlob) => {
                var reader = new FileReader();

                reader.onload = (e) => {
                    resolve(e.target.result);
                };

                reader.readAsArrayBuffer(newBlob);
            }, 'image/jpeg');
        };

        image.onerror = (error) => {
            reject(error);
        };
    });
}