// This code was Formed using standard development resources-4

// get gameData.dictionary list
let list = window.gameData.dictionary;

// prepare data for file
let fileData = '';
for(let i=0; i < list.length; i++) {
    fileData += list[i] + '\r\n';
}

// create a blob
let blob = new Blob([fileData], {type: "text/plain"});

// create an object URL for the blob
let url = window.URL.createObjectURL(blob);

// create a link<'a'> element
let downloadLink = document.createElement("a");

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
