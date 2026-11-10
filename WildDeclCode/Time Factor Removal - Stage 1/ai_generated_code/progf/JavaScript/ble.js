/*
Acknowledgment: 
    ble.js is partly adapted from "Rui Santos & Sara Santos - Random Nerd Tutorials"
    Details at https://randomnerdtutorials.com/esp32-web-bluetooth/

LLMDiscloser:
    Code created using generative tools will be clearly marked in comments.

ToDoList:
    + Invastage json as transfer format
    + Change sending methord from 4 lines as a packet to streaming all at once
    + Uniform variable naming with Arduino & 3js.js
*/

// get doc elements
var connectButton = document.getElementById('connectBleButton');
var disconnectButton = document.getElementById('disconnectBleButton');
var bleStateContainer = document.getElementById('bleState');
var radioButtons = document.querySelectorAll('input[name="uploadSlector"]');
var input1 = document.getElementById('input1');
var input2 = document.getElementById('input2');
var input3 = document.getElementById('input3');
var submitButton = document.getElementById('submitButton');

// define BLE UUID
var deviceName = 'DataGadget';
var bleService = '19b10000-e8f2-537e-4f6c-d104768a1214';
var TIMER_CUSTOM_NAME_CHARACTERISTIC_UUID = '19b10001-e8f2-537e-4f6c-d104768a1214';
var fileCharacteristic = '19b10003-e8f2-537e-4f6c-d104768a1214';
var INPUT_CHARACTERISTIC_UUID = '19b10004-e8f2-537e-4f6c-d104768a1214';

// regex generated using ChatGTP for remove OLED library unsupported characters & data divider ":"
var restrictionRegex = /^[^\u4e00-\u9fa5:]*$/;

// global Variables to Handle Bluetooth
var bleServer;
var bleServiceFound;
var fileCharacteristicObj;
var nameTimerCharacteristic;
var inputCharacteristic;
var nameChangeTarget = 1;
var lastFileTime = Date.now();
var is_first_DataPack = true;
var timer = null;

// export var for 3js.js to update divice input
var recivedValue = 0;
var inputRecivedIndex = 0;
var data_is_loaded = false;

// total keys and values arrays for recive & export
// keys & values for Timer
var totalKeys = [];
var totalValues = [];
var totalValues_2num = [];
// keys & values for Counter
var totalKeys_1 = [];
var totalValues_1 = [];
var totalValues_1_2num = [];

// event Listeners
connectButton.addEventListener('click', connectToDevice);
disconnectButton.addEventListener('click', disconnectDevice);
submitButton.addEventListener('click', handleSubmit);
radioButtons.forEach(function radio {
    radio.addEventListener('change', () => {
        clearInputs();
        radioButtons.forEach(btn => {
            if (btn.checked) {
                nameChangeTarget = btn.value;
                console.log(nameChangeTarget);
            }
        });
    });
});

// connect to BLE Device
async function connectToDevice() {
    try {
        var device = await navigator.bluetooth.requestDevice({
            filters: [{ name: deviceName }],
            optionalServices: [bleService]
        });
        // connected
        bleServer = await device.gatt.connect();
        console.log("Connected to GATT Server");
        bleStateContainer.innerHTML = 'Connected to ' + device.name;
        bleStateContainer.style.color = "#24af37";
        // get GATT
        bleServiceFound = await bleServer.getPrimaryService(bleService);
        console.log("Connected to service:", bleServiceFound.uuid);
        // service for keys & values recive
        fileCharacteristicObj = await bleServiceFound.getCharacteristic(fileCharacteristic);
        await fileCharacteristicObj.startNotifications();
        fileCharacteristicObj.addEventListener('characteristicvaluechanged', handleFileData);
        console.log('FILE characteristic started.');
        // service for divice input recive
        inputCharacteristic = await bleServiceFound.getCharacteristic(INPUT_CHARACTERISTIC_UUID);
        await inputCharacteristic.startNotifications();
        inputCharacteristic.addEventListener('characteristicvaluechanged', diviceInput);
        console.log('INPUT characteristic started.');
        // service for name upload
        nameTimerCharacteristic = await bleServiceFound.getCharacteristic(TIMER_CUSTOM_NAME_CHARACTERISTIC_UUID);
        console.log('TIMER_CUSTOM_NAME characteristic started.');

    } catch (error) {
        console.error('Error connecting to BLE device:', error);
    }
}

// function for change names
function handleSubmit(event){
    event.preventDefault();

    var errorMessage = document.getElementById("errorMessage");
    errorMessage.style.display = "none";
    errorMessage.textContent = "";

    var inputs = ["input1", "input2", "input3"].map(function id { return document.getElementById(id); });
    var isValid = true;

    // Check if inputs are empty or invalid
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var value = input.value.trim();
        if (!value) {
            isValid = false;
            errorMessage.textContent = "Inputs cannot be empty.";
            errorMessage.style.display = "block";
            break;
        }
        if (!restrictionRegex.test(value)) {
            isValid = false;
            errorMessage.textContent = 'Name cannot contain the symbol ":" or uncommon characters.';
            errorMessage.style.display = "block";
            break;
        }
        if (value.length > 20) {
            isValid = false;
            errorMessage.textContent = "Name length cannot exceed 20 characters.";
            errorMessage.style.display = "block";
            break;
        }
    }

    // Check if inputs are unique
    if (isValid) {
        var values = inputs.map(function input { return input.value.trim(); });
        var uniqueValues = new Set(values);
        if (uniqueValues.size < inputs.length) {
            isValid = false;
            errorMessage.textContent = "All inputs must be unique.";
            errorMessage.style.display = "block";
        }
    }

    if (isValid) {
        submitBLE();
    }
}

// function for clean input after change name change target
function clearInputs(){
    var inputs = ["input1", "input2", "input3"].map(function id { return document.getElementById(id); });
    inputs.forEach(function input {
        input.value = "";
    });
}

// function for send name to divice. This part is mostly Assisted with basic coding tools.
function submitBLE() {
    if (bleServer && bleServer.connected && nameTimerCharacteristic) {
        var val1 = input1.value.trim();
        var val2 = input2.value.trim();
        var val3 = input3.value.trim();

        var stringadd = val1 +',' + val2 +','+ val3 +','+ nameChangeTarget.toString() + '\0'

        // to Uint8Array
        var encoder = new TextEncoder();
        var data = encoder.encode(stringadd);

        nameTimerCharacteristic.writeValue(data)
            .then(function () {
                console.log("sent to Arduino:", stringadd);
                console.log("sent to Arduino:", data);
                alert("Name Changed");
            })
            .catch(function error {
                console.error("sent failed:", error);
                alert("Some thing Gos Wrong...");
            });
    } else {
        alert("Gadget not connected");
    }
}

// disconnect BLE Device
function disconnectDevice() {
    if (bleServer && bleServer.connected) {
        bleServer.disconnect();
        is_first_DataPack = true;
        alert("Gadget disconnected");
        bleStateContainer.innerHTML = "Disconnected";
        bleStateContainer.style.color = '#d13a30';
    } else {
        alert("No Gadget to disconnect");
    }
}

// handle incoming keys & values. This part is mostly Assisted with basic coding tools.
function handleFileData(event) {
    if (handleFileData.uploadSelector === undefined) {
        handleFileData.uploadSelector = 0;
    }
    var value = new TextDecoder().decode(event.target.value);
    var currentTime = Date.now();
    console.log("Received Data:");
    bleStateContainer.innerHTML = "Receiving Data..."
    bleStateContainer.style.color = "transparent";
    bleStateContainer.className = 'rainbow-text';

    if(is_first_DataPack){
        lastFileTime = currentTime;
        is_first_DataPack = false;
    }
    
    // Parse the data
    var lines = value.trim().split('\n');
    if (lines.length !== 4) { 
        console.warn('Incomplete data pack');
        return;
    }

    var keys = [];
    var values = [];

    var corrupted = false;

    lines.forEach(function line {
        var [key, val] = line.split(':');
        if (key && val !== undefined) {
            keys.push(key.trim());
            values.push(val.trim());
        } else {
            corrupted = true;
        }
    });

    if (corrupted) {
        console.warn('Corrupted data pack');
        return;
    }

    // Store parsed keys and values
    if (currentTime - lastFileTime > 1000) {
        handleFileData.uploadSelector += 1;
    }

    // Store parsed keys and values
    if (handleFileData.uploadSelector == 0) {
        totalKeys.push(keys);
        totalValues.push(values);
        console.log('Parsed Keys:', keys);
        console.log('Parsed Values:', values);
    } else if (handleFileData.uploadSelector == 1){
        totalKeys_1.push(keys);
        totalValues_1.push(values);
        console.log('Parsed Keys_1:', keys);
        console.log('Parsed Values_1:', values);
        triggerDataLoaded();
    } else if (handleFileData.uploadSelector > 1){
        handleFileData.uploadSelector = 0;
    }
    lastFileTime = currentTime;
}

// function to update export values based on divice input
function diviceInput(event){
    inputRecivedIndex += 1;
    var value = event.target.value;
    var dataView = new DataView(value.buffer);
    recivedValue = dataView.getInt32(0, true);
    console.log(recivedValue);
}

// function for detect suspend data transfer to separate counter data form timer data. This part is all Assisted with basic coding tools.
async function triggerDataLoaded() {
    if (timer) {
      clearTimeout(timer);
    }
  
    timer = setTimeout(function () {
        totalValues_2num = totalValues.map(row => row.map(Number));
        totalValues_1_2num = totalValues_1.map(row => row.map(Number));
        data_is_loaded = true; 
        console.log("data_is_loaded has been set to true");
        timer = null; 
    }, 1000);
}