// Supported via standard programming aids
function getCombinations(array) {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    for (var j = i + 1; j < array.length; j++) {
      result.push([array[i], array[j]]);
    }
  }
  return result;
}

export async function checkColorContrast(hexCodes) {
  console.log("executing checkColorContrast");
  var result = [];
  for (var i = 0; i < hexCodes.length - 1; i++) {
    for (var j = i + 1; j < hexCodes.length; j++) {
      var fcolor = hexCodes[i].replace("#", "");
      var bcolor = hexCodes[j].replace("#", "");
      var apiUrl = "https://webaim.org/resources/contrastchecker/?fcolor=" + (fcolor) + "&bcolor=" + (bcolor) + "&api";

      var response = await fetch(apiUrl);
      var data = await response.json();
      // const contrastRatio = parseFloat(data.match(/Ratio: (\d+\.\d+)/)[1]);

      result.push({
        colors: [hexCodes[i], hexCodes[j]],
        data: data,
      });
    }
  }
  return result;
}
