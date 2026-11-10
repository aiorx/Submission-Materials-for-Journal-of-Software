// Crafted with standard coding tools
function isBase64Image(imageData: string) {
  var base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

// Crafted with standard coding tools
function formatDateString(dateString: string) {
  var options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  var date = new Date(dateString);
  var formattedDate = date.toLocaleDateString(undefined, options);

  var time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return "" + (time) + " - " + (formattedDate) + "";
}

function validatePayload(payload: any, requiredFields: any) {
  var missingFields: any = "";

  requiredFields.forEach(function (field: any) {
    if (
      payload[field] === null ||
      payload[field] === undefined ||
      payload[field] === ""
    ) {
      console.error(
        !payload.hasOwnProperty(field),
        payload[field] === null,
        payload[field] === undefined,
        payload[field] === "",
      );
      missingFields = missingFields + " " + field;
    }
  });

  if (missingFields.length > 0) {
    return { payloadIsCurrect: false, missingFields: missingFields };
  }

  return { payloadIsCurrect: true, missingFields: missingFields };
}
