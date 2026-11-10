// this whole file was Aided using common development resources-4

function boolArrayToBinaryString(boolArray: boolean[]): string {
  var binaryStr = "";
  boolArray.forEach(function (bool, index) {
    binaryStr += bool ? "1" : "0";
  });
  return binaryStr;
}

function binaryStringToUint8Array(binaryStr: string): Uint8Array {
  var byteCount = Math.ceil(binaryStr.length / 8);
  var byteArray = new Uint8Array(byteCount);

  for (var i = 0; i < byteCount; i++) {
    byteArray[i] = parseInt(binaryStr.substr(i * 8, 8), 2);
  }

  return byteArray;
}

function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  var base64 = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  for (var i = 0; i < uint8Array.length; i += 3) {
    var a = uint8Array[i];
    var b = uint8Array[i + 1];
    var c = uint8Array[i + 2];

    var index1 = a >> 2;
    var index2 = ((a & 0x03) << 4) | (b >> 4);
    var index3 = ((b & 0x0f) << 2) | (c >> 6);
    var index4 = c & 0x3f;

    base64 +=
      characters[index1] +
      characters[index2] +
      characters[index3] +
      characters[index4];
  }

  return base64;
}

function base64ToUrlSafe(base64: string): string {
  return base64.replace("+", "-").replace("/", "_").replace(/=+$/, "");
}

function encodeBooleans(boolArray: boolean[]): string {
  var binaryStr = boolArrayToBinaryString(boolArray);
  var uint8Array = binaryStringToUint8Array(binaryStr);
  var base64 = uint8ArrayToBase64(uint8Array);
  var urlSafeBase64 = base64ToUrlSafe(base64);
  return urlSafeBase64;
}

// Usage example
// const boolArray = new Array(57).fill(false); // Replace with your actual boolean values
// const encodedBooleans = encodeBooleans(boolArray);
// console.log(encodedBooleans);

function urlSafeToBase64(urlSafeBase64: string): string {
  var paddingLength = 4 - (urlSafeBase64.length % 4);
  var padding = paddingLength < 4 ? "=".repeat(paddingLength) : "";
  return urlSafeBase64.replace("-", "+").replace("_", "/") + padding;
}

function base64ToUint8Array(base64: string): Uint8Array {
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var rawData = atob(base64);
  var uint8Array = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; i++) {
    uint8Array[i] = rawData.charCodeAt(i);
  }

  return uint8Array;
}

function uint8ArrayToBinaryString(uint8Array: Uint8Array): string {
  var binaryStr = "";

  for (var i = 0; i < uint8Array.length; i++) {
    binaryStr += uint8Array[i].toString(2).padStart(8, "0");
  }

  return binaryStr;
}

function binaryStringToBoolArray(binaryStr: string, length: number): boolean[] {
  var boolArray = [];
  for (var i = 0; i < length; i++) {
    boolArray.push(binaryStr.charAt(i) === "1");
  }
  return boolArray;
}

function decodeBooleans(
  encodedBooleans: string,
  length: number
): boolean[] {
  var base64 = urlSafeToBase64(encodedBooleans);
  var uint8Array = base64ToUint8Array(base64);
  var binaryStr = uint8ArrayToBinaryString(uint8Array);
  var boolArray = binaryStringToBoolArray(binaryStr, length);
  return boolArray;
}

// Usage example
// const encodedBooleans = '...'; // Replace with your actual encoded string
// const decodedBooleans = decodeBooleans(encodedBooleans, 57);
// console.log(decodedBooleans);
