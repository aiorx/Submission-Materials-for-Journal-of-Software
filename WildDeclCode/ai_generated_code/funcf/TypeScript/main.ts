```ts
// Code Supported via standard GitHub programming aids. I don't actually know what these do.
const mostKills = player_list.reduce((max, player) => player.kills > max.kills ? player : max, player_list[0]);
console.log(`Player with most kills: ${mostKills.name} (${mostKills.kills})`);

const mostHoarder = player_list.reduce((max, player) => player.inventory.length > max.inventory.length ? player : max, player_list[0]);
const itemNames = mostHoarder.inventory.map(item => item.name).join(', ');
console.log(`The most hoarder: ${mostHoarder.name} (${mostHoarder.inventory.length})${itemNames ? ` Items: ${itemNames}` : ''}`);
```