var watchFile = require('fs').watchFile;
var unwatchFile = require('fs').unwatchFile;
var chalk = require('chalk');
var fileURLToPath = require('url').fileURLToPath;

global.owner = [
  ['447451239331','Arctix',true],
  ['447451231393','Arceus',true],
  ['919337956084', 'sibu', true],
  //['447451240296']
  // [number, dia creator/owner?, dia developer?]
] // Put your number here
global.mods = [] // Want some help?
global.prems = ['919337956084,447451239331,447451231393'] // Premium user has unlimited limit
global.APIs = { // API Prefix
  // name: 'https://website'
  nrtm: 'https://nurutomo.herokuapp.com',
  xteam: 'https://api.xteam.xyz',
  bx: 'https://bx-hunter.herokuapp.com',
  rey: 'https://server-api-rey.herokuapp.com',
  hardianto: 'https://hardianto.xyz',
  neoxr: 'https://neoxr-api.herokuapp.com',
  zahir: 'https://zahirr-web.herokuapp.com',
  lol: 'https://api.lolhuman.xyz',
  caliph: 'https://caliphapi.com',
  dhnjing: 'https://dhnjing.xyz',
  zeks: 'https://api.zeks.me',
  pencarikode: 'https://pencarikode.xyz',
  fxc7: 'https://fxc7-api.herokuapp.com',
  LeysCoder: 'https://leyscoders-api.herokuapp.com'
}
global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  'https://api.xteam.xyz': 'cristian9407'
   
}

// Sticker WM
global.packname = '𝐀𝐫𝐜𝐭𝐢𝐱'
global.author = '𝐀𝐫𝐜𝐭𝐢𝐱 × 𝐀𝐫𝐜𝐞𝐮𝐬 𝐢𝐧𝐜.'

global.multiplier = 69 // The higher, The harder levelup

global.rpg = {
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
    let results = Object.keys(emot).map(function v { return [v, new RegExp(v, 'gi')]; }).filter(function v { return v[1].test(string); })
    if (!results.length) return ''
    else return emot[results[0][0]]
  }
}


let file = fileURLToPath(import.meta.url)
watchFile(file, function () {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import("" + (file) + "?update=" + (Date.now()) + "")
})
