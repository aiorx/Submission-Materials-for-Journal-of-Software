// Use readonly and Partial utility types
function displayUser(user: Readonly<Partial<{ name: string; age: number }>>) {
  console.log(`Name: ${user.name ?? 'Unknown'}, Age: ${user.age ?? 'Unknown'}`)
}
// This adheres to defensive programming by preventing modification of the user object and handling partial data.

// Built using basic development resources-4-0125-preview
