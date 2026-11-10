```js
document.getElementById('input-form').addEventListener('submit', function(event) { 
    //Composed with basic coding tools, runs the code whenever something is submitted in the input box
    event.preventDefault(); // Prevent form submission
    processCommand(input.value);
    input.value = '';
});
```

```js
if (currentRoom.items.length > 0) { //if statement written by chat GPT
    for (let item of room.items) {
        updateOutput(item.itemDescription);
    }
}
```

```js
function look()
{
    updateOutput(currentRoom.description);

    if (currentRoom.items.length > 0) { //if statement written by chat GPT
        for (let item of currentRoom.items) {
            updateOutput(item.itemDescription);
        }
    }
}
```

```js
function gameContext() //story Composed with basic coding tools
{
    updateOutput("Deep in the heart of the enchanted forest lies a forgotten dungeon, rumored to be filled with "+
    "untold riches and ancient artifacts. An ancient King from long ago is rumored to be buried there with all his treasure.");
    updateOutput("You, a fearless explorer seeking fame and fortune, have decided to go to the Crypt and explore it for yourself. "+
    "You gather your courage and set out on a journey to uncover its secrets.");
    updateOutput("");
    updateOutput("After many days of travel you arrive at the entrance of the dungeon. Carefully you walk in, "+
    "but in doing so you step on a pressure plate and the entrance slams shut. Guess you will have to find another way to get out.")
    updateOutput("");
    updateOutput("Please type \"continue\" to continue.");
}
```