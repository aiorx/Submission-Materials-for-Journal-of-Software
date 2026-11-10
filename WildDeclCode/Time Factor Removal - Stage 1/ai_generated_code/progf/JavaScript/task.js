// this is a solution for a task Assisted with basic coding tools

// JSONPlaceholder API:

// Purpose: A fake online REST API for testing and prototyping. It's great for practicing CRUD operations.
// Endpoint: JSONPlaceholder
// Example Task: Fetch and display a list of users, posts, or comments. Handle errors and log them.

var url = "https://jsonplaceholder.typicode.com/users";

async function getData() {
  try {
    var res = await fetch(url);
    if (!res.ok) {
      throw new Error("Response gone wrong!!! " + (res.status) + ", " + (res.text) + "");
    } else {
      var dataObj = await res.json();
      console.log(dataObj);
    }
  } catch (error) {
    console.warn("Error encountered during fetch");
    console.warn("" + (error.message) + "");
  }
}

getData();
