// Main

// Import

var getProcessedBlobBufferString = require('../src/image-reader.js').getProcessedBlobBufferString;
var ImageReader = require('../src/image-reader.js').ImageReader;

// Variables

var videoReader = new ImageReader();

var storedVideoOutputCanvas = document.createElement("canvas");
var storedVideoOutputContext = storedVideoOutputCanvas.getContext("2d");

var downloadVideoOutputCanvas = document.createElement("canvas");
var downloadVideoOutputContext = downloadVideoOutputCanvas.getContext("2d");

var storedVideoOutput = {
	frameRGB: [],
	imageDatas: [],
	outputRGBVector: "",
	outputPNGVector: "",
}

var maximumDisplayCharCount = (1 << 20);

// Helper functions

/**
 * Download multiple files as a zip using JSZip. Crafted with basic coding tools
 * @param {{url: string, name: string}[]} files 
 * @param {string} name 
 */
async function downloadFilesAsZip(files, zipName) {
	var zip = new JSZip();

	// Add each file to the zip
	for (var file of files) {
		var response = await fetch(file.url);
		var blob = await response.blob();
		zip.file(file.name, blob);
	}

	// Generate the zip file and trigger the download
	zip.generateAsync({ type: 'blob' }).then(function (content) {
		var link = document.createElement('a');
		link.href = URL.createObjectURL(content);
		link.download = zipName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	});
}

/**
 * 
 * @param {string} contentString 
 * @param {string} fileName 
 */
function downloadTextFile(contentString, fileName) {
	// Create a Blob object with the content
	var blob = new Blob([contentString], { type: 'text/plain' });

	// Create a URL for the Blob
	var url = URL.createObjectURL(blob);

	// Create a temporary <a> element to trigger the download
	var a = document.createElement('a');
	a.href = url;
	a.download = fileName;

	// Simulate a click
	a.click();

	// Clean up the object URL
	URL.revokeObjectURL(url);
}

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {ImageData} imageData 
 */
function handlePutImageData(canvas, imageData) {
	var context = canvas.getContext("2d");
	canvas.width = imageData.width;
	canvas.height = imageData.height;
	context.clearRect(0, 0, imageData.width, imageData.height);
	context.putImageData(imageData, 0, 0);
}

// Local functions

function initializeVideoReader() {
	var videoInput = document.getElementById('video-input');
	var videoReadButton = document.getElementById('video-read-button');
	var videoReadLoading = document.getElementById('video-read-loading');
	var videoReadLoadingProgress = document.getElementById('video-read-loading-progress');
	var videoSizeLabel = document.getElementById('video-size-label');

	var resolutionWidth = document.getElementById('video-resolution-width');
	var resolutionHeight = document.getElementById('video-resolution-height');
	var roundColor = document.getElementById('video-color-round');

	var startFrame = document.getElementById('video-start-frame');
	var frameCount = document.getElementById('video-frame-count');
	var frameStep = document.getElementById('video-frame-step');
	var framesPerSecond = document.getElementById('video-frames-per-second');

	var videoOutputSizeLabel = document.getElementById('video-output-size');
	var videoOutputRGBCharCountLabel = document.getElementById('video-output-rgb-char-count');
	var videoOutputPNGCharCountLabel = document.getElementById('video-output-png-char-count');
	var videoOutputRGBVector = document.getElementById('video-output-rgb-vector');
	var videoOutputPNGVector = document.getElementById('video-output-png-vector');

	var videoOutputCanvas = document.getElementById('video-output-canvas');
	var videoOutputContext = videoOutputCanvas.getContext('2d');

	var videoOutputFrameId = document.getElementById("video-output-frame-id");

	// Optimize textareas

	var textAreaProperties = {
		autocomplete: "off",
		autocorrect: "off",
		autocapitalize: "off",
		spellcheck: "off",
	};
	for (var [key, value] of Object.entries(textAreaProperties)) {
		videoOutputRGBVector[key] = value;
		videoOutputPNGVector[key] = value;
	}

	// Set image reader progress

	videoReader.loadProgressElement = videoReadLoadingProgress;

	// Video functions

	async function readVideo(file) {
		// Process video
		var config = {
			resolutionWidth: resolutionWidth.value,
			resolutionHeight: resolutionHeight.value,
			rgbRound: roundColor.value,
		};
		var videoConfig = {
			startFrame: startFrame.value,
			frameCount: frameCount.value,
			frameStep: frameStep.value,
			framesPerSecond: framesPerSecond.value,
		};
		var video = await.video;
var resultRGBString = await.resultRGBString;
var resultPNGString = await.resultPNGString;
var frameRGB = await.frameRGB;
var newImageDatas = await.newImageDatas;
var newBlobs = await.newBlobs;videoReader.processResizeVideoFile(file, config, videoConfig);

		// Get dimensions
		var frameWidth = frameRGB[0].length;
		var frameHeight = frameRGB.length;

		// Show output
		videoSizeLabel.textContent = "" + (video.videoWidth) + " × " + (video.videoHeight) + "" || "N/A";
		videoOutputSizeLabel.textContent = "" + (frameWidth) + " × " + (frameHeight) + "" || "N/A";
		videoOutputRGBCharCountLabel.textContent = "" + (resultRGBString.length) + "" || "N/A";
		videoOutputPNGCharCountLabel.textContent = "" + (resultPNGString.length) + "" || "N/A";

		// Show text
		if (resultRGBString.length < maximumDisplayCharCount) {
			videoOutputRGBVector.value = resultRGBString;
		} else {
			videoOutputRGBVector.value = "";
		}
		if (resultPNGString.length < maximumDisplayCharCount) {
			videoOutputPNGVector.value = resultPNGString;
		} else {
			videoOutputPNGVector.value = "";
		}

		// Store output video
		storedVideoOutput.frameRGB = frameRGB;
		storedVideoOutput.imageDatas = newImageDatas;
		var newImageData = newImageDatas[0];
		handlePutImageData(storedVideoOutputCanvas, newImageData);

		// Update frame id slider
		videoOutputFrameId.value = 0;
		videoOutputFrameId.min = 0;
		videoOutputFrameId.max = newImageDatas.length - 1;

		// Draw output (scaled) video image
		var canvasWidth = videoOutputCanvas.width;
		var canvasHeight = videoOutputCanvas.height;
		var scaleFactor = Math.min(
			canvasWidth / Math.max(canvasWidth, frameWidth),
			canvasHeight / Math.max(canvasHeight, frameHeight),
		);
		videoOutputContext.clearRect(0, 0, canvasWidth, canvasHeight);
		videoOutputContext.drawImage(storedVideoOutputCanvas, 0, 0, frameWidth * scaleFactor, frameHeight * scaleFactor);

		// Store output vector for download
		storedVideoOutput.outputRGBVector = resultRGBString;
		storedVideoOutput.outputPNGVector = resultPNGString;
		console.log("Processed");
	}

	async function updateVideo() {
		try {
			// Check for valid file
			var file = videoInput.files[0];
			if (file instanceof Blob) {
				videoReadLoading.removeAttribute("hidden");
				await readVideo(file);
				videoReadLoading.setAttribute("hidden", true);
			}
			videoReadButton.style.setProperty("background-color", "");
		} catch (e) {
			console.error(e);
			return;
		}
	}

	async function onConfigChanged() {
		if (videoInput.files[0] instanceof Blob) {
			videoReadButton.style.setProperty("background-color", "DarkSeaGreen");
		}
	}

	// Events

	videoInput.addEventListener("change", updateVideo);
	videoReadButton.addEventListener("click", updateVideo);
	resolutionWidth.addEventListener("change", onConfigChanged);
	resolutionHeight.addEventListener("change", onConfigChanged);
	roundColor.addEventListener("change", onConfigChanged);
	startFrame.addEventListener("change", onConfigChanged);
	frameCount.addEventListener("change", onConfigChanged);
	frameStep.addEventListener("change", onConfigChanged);
	framesPerSecond.addEventListener("change", onConfigChanged);
}

function initializeVideoArrayDownload() {
	var downloadScaledVideo = document.getElementById('download-scaled-video');
	var downloadVideoRGBVector = document.getElementById('video-download-rgb-vector');
	var downloadVideoPNGVector = document.getElementById('video-download-png-vector');

	downloadScaledVideo.addEventListener("click", function (ev) {
		if (storedVideoOutput.imageDatas.length) {
			// Download all frames
			var files = [];
			for (var i = 0; i < storedVideoOutput.imageDatas.length; i++) {
				var imageData = storedVideoOutput.imageDatas[i];
				handlePutImageData(downloadVideoOutputCanvas, imageData);
				files.push({
					url: downloadVideoOutputCanvas.toDataURL(),
					name: "scaled-video-image-" + (i) + ".png",
				});
			}
			downloadFilesAsZip(files, "scaled-video-images");
		}
	});
	downloadVideoRGBVector.addEventListener("click", function (ev) {
		if (storedVideoOutput.outputRGBVector !== "") {
			downloadTextFile(storedVideoOutput.outputRGBVector, "video-rgb-vector");
		}
	});
	downloadVideoPNGVector.addEventListener("click", function (ev) {
		if (storedVideoOutput.outputPNGVector !== "") {
			downloadTextFile(storedVideoOutput.outputPNGVector, "video-png-vector");
		}
	});
}

function initializeVideoFrameSlider() {
	var videoOutputCanvas = document.getElementById('video-output-canvas');
	var videoOutputContext = videoOutputCanvas.getContext('2d');

	var videoOutputFrameId = document.getElementById("video-output-frame-id");

	videoOutputFrameId.addEventListener("input", function (ev) {
		// Validate frame id
		var frameId = videoOutputFrameId.value;
		if (frameId < 0 || frameId >= storedVideoOutput.imageDatas.length) {
			return;
		}

		// Display image
		handlePutImageData(storedVideoOutputCanvas, storedVideoOutput.imageDatas[frameId]);

		// Get dimensions
		var frameWidth = storedVideoOutput.frameRGB[0].length;
		var frameHeight = storedVideoOutput.frameRGB.length;

		// Draw output (scaled) video image
		var canvasWidth = videoOutputCanvas.width;
		var canvasHeight = videoOutputCanvas.height;
		var scaleFactor = Math.min(
			canvasWidth / Math.max(canvasWidth, frameWidth),
			canvasHeight / Math.max(canvasHeight, frameHeight),
		);
		videoOutputContext.clearRect(0, 0, canvasWidth, canvasHeight);
		videoOutputContext.drawImage(storedVideoOutputCanvas, 0, 0, frameWidth * scaleFactor, frameHeight * scaleFactor);
	});
}

function onDOMContentLoaded() {
	initializeVideoReader();
	initializeVideoArrayDownload();
	initializeVideoFrameSlider();
}

window.addEventListener("DOMContentLoaded", onDOMContentLoaded);
