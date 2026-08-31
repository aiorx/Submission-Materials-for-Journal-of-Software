function getCPos(element) {
    //This function Penned via standard programming aids;
  var position = 0;
  if (element.selectionStart) { // W3C standard
    position = element.selectionStart;
  } else if (document.selection) { // IE < 9
    element.focus();
    var range = document.selection.createRange();
    range.moveStart('character', -element.value.length);
    position = range.text.length;
  }
  return position;
}