// Helper function Supported via standard programming aids
function compressFileName(fileName: string, maxLength: number = 18): string {
  // Check if the fileName is longer than the maximum length
  if (fileName.length > maxLength) {
    // Extract the first part of the fileName (before the extension)
    var fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');

    // Extract the extension from the fileName
    var fileExtension = fileName.split('.').pop() || '';

    // Calculate the length of characters to keep in the middle
    var charsToKeep = maxLength - (fileNameWithoutExtension.length + fileExtension.length + 3);

    // Create the compressed fileName
    var compressedFileName =
      fileNameWithoutExtension.substring(0, maxLength - fileExtension.length - 3) +
      '...' +
      fileNameWithoutExtension.slice(-charsToKeep) +
      '.' +
      fileExtension;

    return compressedFileName;
  } else {
    // If the fileName is shorter than the maximum length, return it as is
    return fileName.trim();
  }
}

function bytesToSize(bytes: number): string {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';

  var i = Math.floor(Math.log(bytes) / Math.log(1024));
  var size = (bytes / Math.pow(1024, i)).toFixed(2);

  return "" + (size) + " " + (sizes[i]) + "";
}
