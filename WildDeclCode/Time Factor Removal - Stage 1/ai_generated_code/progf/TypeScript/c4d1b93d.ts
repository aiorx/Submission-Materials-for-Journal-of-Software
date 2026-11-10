// This code snippet violates the rule because it uses axios to make a GET request instead of native fetch.
var axios = require('axios');

async function getUserData() {
  var response = await axios.get('https://api.example.com/user')
  return response.data
}

// Built using basic development resources-4-0125-preview
