// Example 4: Extracting essential user information
interface UserInput {
  id: string | number
  name: string
  email?: string
}

interface User {
  id: number
  name: string
}

function extractUserInfo(input: UserInput): User {
  // Accepts a broader UserInput type but returns a strict User type
  return { id: Number(input.id), name: input.name }
}

// Built using basic development resources-4-0125-preview
