// Formed using common development resources
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
