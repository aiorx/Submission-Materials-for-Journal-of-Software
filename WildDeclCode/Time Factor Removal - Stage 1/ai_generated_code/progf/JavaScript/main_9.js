/**
 * This script was written using GitHub CoPilot.
 * The following comments were provide directly by CoPilot and may indicate the autor whose code was used to generate the code below.
 */
/**
 **********************************************************************************************************************
 * Begin comments Aided with basic GitHub coding tools
 **********************************************************************************************************************
 Source Language: JavaScript
 Author: Mashiro
 Last Modified: 2021-07-18T14:00:00+08:00
 Description: Read a text file line by line
 **********************************************************************************************************************
 * End comments Aided with basic GitHub coding tools
 **********************************************************************************************************************
 */

var fs = require('fs');

// Check if the command line argument is provided
if (process.argv.length < 3) {
  console.error('Please provide a text file as a command line argument.');
  process.exit(1);
}

class RoundResult {
    red = 0;
    green = 0;
    blue = 0;

    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    isValid(maxRed, maxGreen, maxBlue) {
        var bIsValid = true;

        if (!isNaN(this.red) && this.red > maxRed) {
            bIsValid = false;
        }
        if (!isNaN(this.green) && this.green > maxGreen) {
            bIsValid = false;
        }
        if (!isNaN(this.blue) && this.blue > maxBlue) {
            bIsValid = false;
        }

        return bIsValid;
    }

    toString() {
        return "red: " + (this.red) + ", green: " + (this.green) + ", blue: " + (this.blue) + "";
    }
}

class GameResult {
    id = 0;
    rounds = [];
    MaxResults = new RoundResult(12, 13, 14);
    isValid = true;
    power = Number.MAX_SAFE_INTEGER;

    constructor(id, rounds) {
        this.id = id;
        this.rounds = rounds;

        var mostRed = 0;
        var mostGreen = 0;
        var mostBlue = 0;

        if (rounds.length > 0) {
            rounds.forEach(function round {
                this.isValid = this.isValid && round.isValid(this.MaxResults.red, this.MaxResults.green, this.MaxResults.blue);
                if (round.red > mostRed) {
                    mostRed = round.red;
                }
                if (round.green > mostGreen) {
                    mostGreen = round.green;
                }
                if (round.blue > mostBlue) {
                    mostBlue = round.blue;
                }
            })
        }

        this.power = mostRed * mostGreen * mostBlue;
    }

    toString() {
        return "id: " + (this.id) + ", isValid: " + (this.isValid) + " rounds: " + (this.rounds) + "\npower: " + (this.power) + "";
    }
}

// Array that will be used to store GameResults from file.
var gameResults = [];

var filePath = process.argv[2];

// Read the file line by line
var readStream = fs.createReadStream(filePath, 'utf8');

readStream.on('data', function (chunk) {
    var lines = chunk.split('\n');
    
    // Process each line
    lines.forEach((line) => {
        console.log("\nline: " + line);
        // Parse the data here
        linecomp = line.split(':');
        var id = parseInt(linecomp[0].split(' ')[1]); // parseInt(lineParts[0].match(/Game (\d+)/)[1]);
        var lineParts = linecomp[1].split(';');
        // console.log("lineParts: " + lineParts);
        console.log("id: " + id);
        var rounds = lineParts.slice().map((round) => {
            var roundParts = round.split(',');
            console.log("roundParts: " + roundParts);
            var red = parseInt(roundParts.find(part => part.includes('red')));
            console.log("red: " + red);
            var green = parseInt(roundParts.find(part => part.includes('green')));
            console.log("green: " + green);
            var blue = parseInt(roundParts.find(part => part.includes('blue')));
            console.log("blue: " + blue);
            return new RoundResult(isNaN(red) ? 0 : red, isNaN(green) ? 0 : green, isNaN(blue) ? 0 : blue);
        });
        // console.log("rounds: " + rounds);
        var gameResult = new GameResult(id, rounds);
        gameResults.push(gameResult);
        console.log("gameResult: " + gameResult);
    });
});

readStream.on('end', function () {
    console.log('File reading completed.');
    var IDsum = 0;
    var POWsum = 0;
    gameResults.forEach((gameResult) => {
        if (gameResult.isValid) {
            console.log(gameResult.toString());
            IDsum += gameResult.id;
        }
        POWsum += gameResult.power;
    });
    console.log("IDsum: " + (IDsum) + "");
    console.log("POWsum: " + (POWsum) + "");
});

readStream.on('error', function (err) {
    console.error('Error reading the file:', err);
});
