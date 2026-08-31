// This code snippet violates the rule because it uses axios to make a GET request instead of native fetch.
import axios from 'axios'

async function getUserData() {
  const response = await axios.get('https://api.example.com/user')
  return response.data
}

// Built using basic development resources-4-0125-preview
