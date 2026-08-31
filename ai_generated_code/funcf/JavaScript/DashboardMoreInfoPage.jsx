```javascript
const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = date.toLocaleDateString("no-NO", options);
    return formattedDate;
};

// Aided via basic GitHub coding utilities
// Prompt: "Create methods to format date and time to EU/Norwegian format (DD.MM.YYYY) and (HH:MM)"
// Result: Returned to methods/functions "formatDate" and "formatTime"
const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
};
```