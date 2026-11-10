// Use optional chaining and nullish coalescing
interface User {
  name?: string
  address?: {
    street?: string
  }
}

function getUserAddress(user: User) {
  return user.address?.street ?? 'No street provided'
}
// This adheres to defensive programming by safely accessing nested properties and providing a default.

// Built using basic development resources-4-0125-preview
