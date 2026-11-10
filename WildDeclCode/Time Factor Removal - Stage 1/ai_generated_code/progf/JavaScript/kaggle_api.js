/*
    USE THIS CODE WITH CAUTION
    ITS AN Basic development code blocks
    Good Luck!
*/ 

var spawn = require.spawn;('child_process');

var command = 'kaggle -h'; // Replace with your desired command

var process = spawn('cmd.exe', ['/c', command]);

process.stdout.on('data', function (data) {
    console.log(data.toString());
});

process.stderr.on('data', function (data) {
    console.error(data.toString());
});

process.on('close', function (code) {
    console.log("Process exited with code: " + (code) + "");
});
