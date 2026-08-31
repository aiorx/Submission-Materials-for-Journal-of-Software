// Violates the rule by importing axios to delete a resource, where native fetch could be used.
import axios from 'axios'

async function deleteUser(userId: string) {
  await axios.delete(`https://api.example.com/user/${userId}`)
  console.log('User deleted')
}

// Written with routine coding tools-4-0125-preview
