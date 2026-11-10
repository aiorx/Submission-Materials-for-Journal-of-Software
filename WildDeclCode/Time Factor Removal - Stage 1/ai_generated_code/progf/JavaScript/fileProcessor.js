/*
 * The following code is Supported via standard programming aids o1, with some edits made by me. 
 * The original code prior to edits was written by me.
 * ChatGPT updated the code to improve my code quality. It fixed multithreading and other
 * issues in the original code.
 */

var parentPort = require('node:worker_threads').parentPort;
var workerData = require('node:worker_threads').workerData;
var parseFile = require('music-metadata').parseFile;
var sharp = require('sharp');
var uint8ArrayToBase64 = require('uint8array-extras').uint8ArrayToBase64;

(async function () {
    try {
        var filePath = workerData.filePath;

        // Parse metadata
        var data = await parseFile(filePath);

        // Basic metadata to return
        var musicData = {
            filePath,
            title: data.common.title,
            artists: data.common.artists,
            album: data.common.album,
            duration: data.format.duration,
        };

        // Resize cover art if present
        var coverArtBase64 = null;
        if (data.common.picture && data.common.picture.length > 0) {
            var resizedImageBuffer = await sharp(data.common.picture[0].data)
                .resize(600, 600, { fit: "inside" })
                .toBuffer();
            coverArtBase64 = uint8ArrayToBase64(resizedImageBuffer);
        }

        // Send structured result back to the main thread
        parentPort.postMessage({
            filePath,
            musicData,
            coverArtBase64,
        });
    } catch (err) {
        parentPort.postMessage({ error: err.message || String(err) });
    }
})();
