// This code was Formed using standard development resources-4

// get gameData.dictionary list
var list = window.gameData.dictionary;

// prepare data for file
var fileData = '';
for(var i=0; i < list.length; i++) {
    fileData += list[i] + '\r\n';
}

// create a blob
var blob = new Blob([fileData], {type: "text/plain"});

// create an object URL for the blob
var url = window.URL.createObjectURL(blob);

// create a link<'a'> element
var downloadLink = document.createElement("a");

// set the download link href to the blob URL
downloadLink.href = url;
downloadLink.target="_blank";

// set the download link text
downloadLink.download = "dictionary2.txt";

// append the link to document body
document.body.appendChild(downloadLink);

// simulate click
downloadLink.click();

// after simulate click remove the link from document
document.body.removeChild(downloadLink);
