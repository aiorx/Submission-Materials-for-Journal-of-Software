```javascript
function convertToAMPM(timestamp) {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  let hours = date.getHours(); // Get hours (0-23)
  const minutes = date.getMinutes(); // Get minutes
  const ampm = hours >= 12 ? "PM" : "AM"; // Determine AM or PM

  // Convert 24-hour format to 12-hour format
  hours = hours % 12 || 12;

  // Format minutes to always show two digits
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // Return time in HH:MM AM/PM format
  return `${hours}:${formattedMinutes} ${ampm}`;
}
```