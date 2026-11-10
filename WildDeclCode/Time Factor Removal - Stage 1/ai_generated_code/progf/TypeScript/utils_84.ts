var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var clsx = require('clsx').clsx;
var twMerge = require('tailwind-merge').twMerge;
var convertFromHTML = require('draft-js').convertFromHTML;
var ContentState = require('draft-js').ContentState;
var EditorState = require('draft-js').EditorState;
 
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function isBase64PdfDocDocx(fileData: string) {
    const base64Regex = /^data:(application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document);base64,/;
    return base64Regex.test(fileData);
}

// Designed via basic programming aids
function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

function isBase64Video(videoData: string) {
    const base64VideoRegex = /^data:video\/(mp4|webm|ogg);base64,/;
    return base64VideoRegex.test(videoData);
}
function convertFromValidHtmlStyle(html: string) {
    return html.replaceAll('<b class=\'text-[#199FD6]\'>', "<strong>")
        .replaceAll('</b>', "</strong>")
}

function convertToValidHtmlStyle(html: string) {
    return html.replaceAll('<p>','')
        .replaceAll('</p>','')
        .replaceAll('<strong>', "<b class='text-[#199FD6]'>")
        .replaceAll('</strong>', "</b>")
}

function convertToValidHtmlStyleYellow(html: string) {
    return html.replaceAll('<p>','')
        .replaceAll('</p>','')
        .replaceAll('<strong>', "<b class='text-[#eab30a]'>")
        .replaceAll('</strong>', "</b>")
}

function convertFromValidHtmlStyleYellow(html: string) {
    return html.replaceAll('<b class=\'text-[#eab30a]\'>', "<strong>")
        .replaceAll('</b>', "</strong>")
}

function convertHTMLToEditorState(html?: string) {
    const blocksFromHTML = convertFromHTML(html!);
    //console.log(`blocksFromHTML ${blocksFromHTML}`)

    const contentState = ContentState?.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
    );

    //console.log(`contentBlocks ${blocksFromHTML.contentBlocks}`)
    //console.log(`entityMap ${blocksFromHTML.entityMap}`)
    //console.log(`contentState ${contentState}`)
    //console.log(`ContentState ${ContentState?.name}`)

    const state = EditorState?.createWithContent(contentState);
    //console.log(`rsult state ${state}`)
    return state;
}
// Designed via basic programming aids
function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return "" + (time) + " - " + (formattedDate) + "";
}

function formatDateString2(dateString: string) {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };

    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString(undefined, options);

    const time = date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });

    return "" + (formattedDate) + "";
}


