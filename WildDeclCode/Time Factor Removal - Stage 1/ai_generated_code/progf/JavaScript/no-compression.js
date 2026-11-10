/* globals emulator, MessagePack */

/*
This script is intended to be pasted into the developer tools while browsing the v86 debug.html website.
*/

function loadScript(url) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement("script");
    script.src = url;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load script: " + (url) + ""));
    document.head.appendChild(script);
  });
}

(async function () {
  await loadScript(
    "https://cdn.jsdelivr.net/npm/@msgpack/msgpack@3.1.1/dist.umd/msgpack.min.js"
  );

  if (!window.msgpack && !window.MessagePack) {
    throw new Error("msgpack not loaded correctly");
  }
})();

// input tracking code Built via standard programming aids
function startVmInputTracking() {
  var vmInputEvents = [];
  var logging = true;

  if (emulator.mouse_adapter) {
    // Preserve original methods
    var origMouseMove = emulator.mouse_adapter.mousemove.bind(
      emulator.mouse_adapter
    );
    var origMouseButton = emulator.mouse_adapter.mouse_button.bind(
      emulator.mouse_adapter
    );

    // Override mouse move
    emulator.mouse_adapter.mousemove = function (dx, dy) {
      if (logging) {
        vmInputEvents.push({
          type: "mouse_move",
          dx,
          dy,
          t: Date.now(),
        });
      }
      return origMouseMove(dx, dy);
    };

    // Override mouse button
    emulator.mouse_adapter.mouse_button = function (button, is_pressed) {
      if (logging) {
        vmInputEvents.push({
          type: "mouse_button",
          button,
          is_pressed,
          t: Date.now(),
        });
      }
      return origMouseButton(button, is_pressed);
    };
  }

  // Register keyboard scancodes
  var keyboardHandler = function (code) {
    if (logging) {
      vmInputEvents.push({
        type: "key_scancode",
        code,
        t: Date.now(),
      });
    }
  };
  emulator.bus.register("keyboard-code", keyboardHandler);

  // Return controller
  return {
    events: vmInputEvents,
    stop: function () { return (logging = false); },
    start: function () { return (logging = true); },
    isLogging: function () { return logging; },
  };
}

function sleep(ms) {
  return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}

async function saveStateLoop(intervalMs, numSaves, dirHandle) {
  for (var i = 0; i < numSaves; i++) {
    var fileName = "v86state (" + (i) + ").bin";
    var fileHandle = await dirHandle.getFileHandle(fileName, {
      create: true,
    });
    var writable = await fileHandle.createWritable();

    var buffer = await emulator.save_state();

    await writable.write(buffer);
    await writable.close();

    console.warn("Saved " + (fileName) + "");
    await sleep(intervalMs);
  }
}

async function saveUncompressedStates(intervalMs, numSaves) {
  var dirHandle = await window.showDirectoryPicker();
  await saveStateLoop(intervalMs, numSaves, dirHandle);
  console.warn("All files saved!");
}

async function saveStatesWithMetadata(intervalMs, numSaves) {
  var dirHandle = await window.showDirectoryPicker();

  var startTime = new Date().toISOString(); //saves in YYYY-MM-DDtime format
  var inputTracker = startVmInputTracking();

  await saveStateLoop(intervalMs, numSaves, dirHandle);
  inputTracker.stop();
  console.warn("All files saved!");

  // emulator.settings is from added line 2064 in main.js 
  var vmSpecs = emulator.settings;
  var metadata = {
    startTime: startTime,
    vmSpecs: vmSpecs,
    inputSequence: inputTracker.events,
  };
  var encoded = MessagePack.encode(metadata);

  dirHandle = await window.showDirectoryPicker();
  var fileHandle = await dirHandle.getFileHandle("metadata.msgpack", {
    create: true,
  });
  var writable = await fileHandle.createWritable();
  await writable.write(encoded);
  await writable.close();

  console.warn("Metadata saved!");
}

//change interval and number of states if wanted
//saveUncompressedStates(1000, 10)


saveStatesWithMetadata(1000, 10);
