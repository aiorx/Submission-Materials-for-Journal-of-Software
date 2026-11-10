//this function Aided using common development resources
function updateImageSize(image, referenceText) {
  // hidden element to measure title height
  var measureSpan = document.createElement('span');
  measureSpan.className = 'measure-span';
  measureSpan.style.font = window.getComputedStyle(referenceText).font;
  measureSpan.textContent = 'Hg';
  document.body.appendChild(measureSpan);

  var textHeight = measureSpan.offsetHeight;
  document.body.removeChild(measureSpan);

  var aspectRatio = image.naturalWidth / image.naturalHeight;
  image.style.height = "" + (textHeight) + "px";
  image.style.width = "" + (textHeight * aspectRatio) + "px";
}

function observeTextResize(imageId, referenceTextSelector) {
  var referenceText = document.querySelector(referenceTextSelector);
  var image = document.getElementById(imageId);

  var resizeObserver = new ResizeObserver(function () {
    updateImageSize(image, referenceText);
  });

  resizeObserver.observe(referenceText);
  updateImageSize(image, referenceText); //initial call
}

window.onload = function () {
  observeTextResize('imageToResize', '#textContainer');
};

//Toggleable menu for mobile
function displayDropdown() {
  var drop = document.getElementById("dropdown");
  if (drop.style.display === "block") {
    drop.style.display = "none";
  } else {
    drop.style.display = "block"
  }
}

document.getElementById("hamburgerIcon").addEventListener("click", displayDropdown);

function expandTable() {
  var table = document.getElementById("contentTable");
  if (table.style.display === "block") {
    table.style.display = "none";
  } else {
    table.style.display = "block";
  }
}
document.getElementById("contentIcon").addEventListener("click", expandTable);