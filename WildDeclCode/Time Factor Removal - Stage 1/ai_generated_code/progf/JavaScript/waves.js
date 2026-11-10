//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Part of audio engine - but on mainThread - fetches and opens wave files for alternative sounds
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//This code is not optimised for performance - it is intended to be fairly easy to understand and modify
//It is not intended to be used in production code
//Copyright N.Whitehurst 2024
//https://github.com/Rippletank/2024-01-10-Bass-Phase
//MIT License - use as you wish, but no warranty of any kind, express or implied, is provided with this software
//Code was written with the help of Github Copilot, particularly for UI/CSS stuff and some mundane refactoring chores
//Web Audio API documentation: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API & https://mdn.github.io/webaudio-examples/voice-change-o-matic/ for FFT
//Wikipedia for refresher on harmonic series and related
//Quick IIF refresher and general approach for suitable smoothing values https://zipcpu.com/dsp/2017/08/19/simple-filter.html
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Duplicated with GUI, but this is the audio engine worker side - allow browser to handle duplication via caching?
var serverWaveList = [];
var waveListPromise = fetch('./waveList.json')//Wavelist NOT in shared folder, can be different for each instance
    .then(function response { return response.json(); })
    .then(function list {
        if (!Array.isArray(list)) throw new Error('Wave List is not an array');
        var newList = [];
        list.forEach(fileName => {
            if (fileName) {
                newList.push(fileName);
            }})
        serverWaveList = newList;
        return serverWaveList;})
    .catch(function (error) {
        console.error('Error fetching Wave List:', error);
    });

function fetchWaveListAsync() {
    return waveListPromise;
}

//Needs the correct sample rate to ensure the import is pitched correctly
//CAN'T work on workerThread because audioConext is not available there
var audioContext = null;
function ensureAudioContext(sampleRate){
    if (!audioContext || audioContext.sampleRate != sampleRate){
        audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate:sampleRate});
    }
    return audioContext;
}

var waveArray = {};

function getWaveOrNullByName(name){
    if (waveArray[name]){
        //clone the wave ready to push to audio Worker thread
        var returnArray = [];
        waveArray[name].forEach(function channel {
            returnArray.push(new Float32Array(channel));
        });
        return returnArray;
    }
    else{
        return null;
    }
}



//Callback takes two variables, the buffer and a flag saying if it was fetched or not (ie it was already in memory)
//Tells the callback if it has been delayed or if it is instant
function fetchWaveByName(sampleRate, name, callback){
    if (!name || name=="" || name=="null"){
        callback(null, false);
        return;
    }
    if (waveArray[name]){
        callback(getWaveOrNullByName(name), false);
        return;
    }
    if (!waveArray[name]){
        ensureAudioContext(sampleRate);
        fetch('../waves/' + name + '.wav')
            .then(function response { return response.arrayBuffer(); })
            .then(function arrayBuffer { return audioContext.decodeAudioData(arrayBuffer); })
            .then(function audioBuffer {
                // The audioBuffer variable now contains the decoded audio data
                var data = [];
                for (var i = 0; i < audioBuffer.numberOfChannels; i++){
                    data.push(audioBuffer.getChannelData(i));
                }
                waveArray[name] = data;
                console.log("audioBuffer for " + name + " loaded.("+data[0].length+"samples)");
                callback(getWaveOrNullByName(name), true);
            })
            .catch(function e {
                console.error('Error fetching or decoding audio file: '+name, e);
                callback(null);
            });            
    }
}
