```js
emoticon(string) {
  string = string.toLowerCase()
  let emot = {
    level: '🧬',
    limit: '🌌',
    health: '❤️',
    exp: '✉️',
    money: '💵',
    potion: '🥤',
    diamond: '💎',
    common: '📦',
    uncommon: '🎁',
    mythic: '🗳️',
    legendary: '🗃️',
    pet: '🎁',
    trash: '🗑',
    armor: '🥼',
    sword: '⚔️',
    wood: '🪵',
    rock: '🪨',
    string: '🕸️',
    horse: '🐎',
    cat: '🐈',
    dog: '🐕',
    fox: '🦊',
    petFood: '🍖',
    iron: '⛓️',
    gold: '👑',
    emerald: '💚'
  }
  let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
  if (!results.length) return ''
  else return emot[results[0][0]]
}
```