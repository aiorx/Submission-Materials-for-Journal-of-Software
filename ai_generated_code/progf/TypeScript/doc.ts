// some nonsense code Assisted with basic coding tools
export const doc = `\
/** @deprecated Use \`newFetchData\` instead */
function oldFetchData(): string {
  return "data";
}

function newFetchData(): string {
  return "new data";
}

interface User {
  id: number;
  name: string;
}

const user: User = {
  id: "123", // Type 'string' is not assignable to type 'number'
  // name is missing — Property 'name' is missing
};

function greet(person: string | null) {
  if (person) {
    console.log("Hello, " + person.toUpperCase());
  } else {
    console.log("Hello, stranger.");
  }
}

const unusedValue = 42; // declared but never used

const data = oldFetchData(); // deprecated
`
