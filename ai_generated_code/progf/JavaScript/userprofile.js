//button animation (assist Assisted using common GitHub development aids)
$(document).ready(function() {
    $('.product-item').hover(function() {
        $(this).find('.product-button').css({'visibility': 'visible', 'opacity': 1});
    }, function() {
        $(this).find('.product-button').css({'visibility': 'hidden', 'opacity': 0});
    });
});
//logic of previous page button
window.onload = function() {
    var referrer = "Previous Page";
    var link = document.getElementById('historyLink');
    link.textContent = referrer;
    link.onclick = function() {
        if (window.location.href.includes('#')) {
            history.go(-2);
        } else {
            history.go(-1);
        }
        return false;
    }
}
function validateInput(event) {
    var element = event.target;
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var selectionStart = range.startOffset;
    var selectionEnd = range.endOffset;
    var value = element.textContent.replace(/[^0-9.$]/g, '');

    // Update the text content of the element before setting the cursor position
    element.textContent = value;
    // Check if the text node exists before setting the cursor position
    if (element.firstChild) {
        if (event.inputType === 'insertText' && event.data && /^[a-zA-Z]/.test(event.data)) {
            range.setStart(element.firstChild, Math.min(element.firstChild.length, selectionStart));
            range.setEnd(element.firstChild, Math.min(element.firstChild.length, selectionEnd-1));
        }
        else{
            range.setStart(element.firstChild, Math.min(element.firstChild.length, selectionStart));
            range.setEnd(element.firstChild, Math.min(element.firstChild.length, selectionEnd));
        }
    }
    selection.removeAllRanges();
    selection.addRange(range);
}
function clearContent(event) {
    var element = event.target;
    element.textContent = '';
    var selection = window.getSelection();
    var range = document.createRange();
    range.setStart(element.firstChild, 1); // Set cursor after the '$' sign
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}
function handleKeyDown(event) {
    if (event.key === 'Enter') {
        event.target.blur();
    } 
}
function handleBlur(event) {
    var element = event.target;
    element.textContent = "$" + element.textContent;
}
