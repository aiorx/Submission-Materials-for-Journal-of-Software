// Using native fetch with additional options for a DELETE request
fetch('https://api.example.com/resource', {
  method: 'DELETE',
  headers: {
    Authorization: 'Bearer your-token-here'
  }
})
  .then(function () { return console.log('Resource deleted'); })
  .catch(function (error) { return console.error('Error:', error); })
// This code correctly adheres to the rule by utilizing native fetch for making HTTP requests without axios.

// Produced via common programming aids-4-0125-preview
