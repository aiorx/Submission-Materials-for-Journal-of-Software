/**
 * COMP4537 - Lab 3
 * Name: Victor Liu #A00971668 - Set C
 * Date: 2024-09-29
 * 
 * index.js
 * 
 * Note: code Supported via standard programming aids has been commented where used.
 */



//ChatGPT: implement dynamic text on client
const currentDomain = window.location.hostname;
const currentProtocol = window.location.protocol;
const currentPort = window.location.port; // Get the port number

// Construct the full URL, including the port if it's present
const fullUrlGetDate = `${currentProtocol}//${currentDomain}${currentPort ? `:${currentPort}` : ''}/COMP4537/labs/3/getDate?name=PLACEHOLDER`;
const fullUrlRead = `${currentProtocol}//${currentDomain}${currentPort ? `:${currentPort}` : ''}/COMP4537/labs/3/readFile/file.txt`;
const fullUrlWrite = `${currentProtocol}//${currentDomain}${currentPort ? `:${currentPort}` : ''}/COMP4537/labs/3/writeFile?text=PLACEHOLDER_TEXT`;

console.log("GetDate URL:", fullUrlGetDate);
console.log("Read URL:", fullUrlRead);
console.log("Write URL:", fullUrlWrite);


// Update the href of the anchor element
const dynamicUrlElement = document.getElementById('dynamic-url');
const dynamicUrlReadElement = document.getElementById('url-read');
const dynamicUrlWriteElement = document.getElementById('url-write');

dynamicUrlElement.href = fullUrlGetDate;
dynamicUrlReadElement.href = fullUrlRead;
dynamicUrlWriteElement.href = fullUrlWrite;

// Replace the innerHTML of the <code> element to keep styling
dynamicUrlElement.innerHTML = `<code>${currentProtocol}//${currentDomain}${currentPort ? `:${currentPort}` : ''}/COMP4537/labs/3/getDate?name=<span class="make-red">PLACEHOLDER</span></code>`;
dynamicUrlReadElement.innerHTML = `<code>${currentProtocol}//${currentDomain}${currentPort ? `:${currentPort}` : ''}/COMP4537/labs/3/readFile/file.txt</code>`;
dynamicUrlWriteElement.innerHTML = `<code>${currentProtocol}//${currentDomain}${currentPort ? `:${currentPort}` : ''}/COMP4537/labs/3/writeFile?text=<span class="make-red">PLACEHOLDER_TEXT</span></code>`;

