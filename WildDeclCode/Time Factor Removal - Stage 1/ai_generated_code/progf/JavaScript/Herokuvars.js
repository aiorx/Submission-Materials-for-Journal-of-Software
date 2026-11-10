// thanks chatgpt😻😻

var zokou = require.zokou;("../framework/zokou");
var Heroku = require('heroku-client');
var s = require("../set");

// Command to retrieve Heroku config vars
zokou({
  nomCom: 'allvar',
  categorie: "HEROKU-CLIENT"
}, async function (chatId, zk, context) {
  var repondre = context.repondre;
var superUser = context.superUser;

  // Check if the command is issued by the owner
  if (!superUser) {
    return repondre("*This command is restricted to the bot owner or 𝐙𝐄𝐙𝐄𝟒𝟕-𝐌𝐃 owner 💀*");
  }

  var appname = s.HEROKU_APP_NAME;
  var herokuapi = s.HEROKU_API_KEY;

  var heroku = new Heroku({
    token: herokuapi,
  });

  var baseURI = "/apps/" + (appname) + "/config-vars";

  try {
    // Fetch config vars from Heroku API
    var configVars = await heroku.get(baseURI);

    var str = '*╭───༺All my Heroku vars༻────╮*\n\n';
    
    // Loop through the returned config vars and format them
    for (var key in configVars) {
      if (configVars.hasOwnProperty(key)) {
        str += "★ *" + (key) + "* = " + (configVars[key]) + "\n";
      }
    }

    // Send the formatted response back to the user
    repondre(str);

  } catch (error) {
    console.error('Error fetching Heroku config vars:', error);
    repondre('Sorry, there was an error fetching the config vars.');
  }
});

// Command to set a Heroku config var
zokou({
  nomCom: 'setvar',
  categorie: "HEROKU-CLIENT"
}, async function (chatId, zk, context) {
  var repondre = context.repondre;
var superUser = context.superUser;
var arg = context.arg;

  // Check if the command is issued by the owner
  if (!superUser) {
    return repondre("*This command is restricted to the bot owner or 𝐙𝐄𝐙𝐄𝟒𝟕-𝐌𝐃 owner 💀*");
  }

  var appname = s.HEROKU_APP_NAME;
  var herokuapi = s.HEROKU_API_KEY;

  if (!arg || arg.length !== 1 || !arg[0].includes('=')) {
    return repondre('Incorrect Usage:\nProvide the key and value correctly.\nExample: setvar ANTICALL=yes');
  }

  var [key, value] = arg[0].split('=');

  var heroku = new Heroku({
    token: herokuapi,
  });

  var baseURI = "/apps/" + (appname) + "/config-vars";

  try {
    // Set the new config var
    await heroku.patch(baseURI, {
      body: {
        [key]: value,
      },
    });

    // Notify success
    await repondre("*✅ The variable " + (key) + " = " + (value) + " has been set successfully. The bot is restarting...*");
  } catch (error) {
    console.error('Error setting config variable:', error);
    await repondre("❌ There was an error setting the variable. Please try again later.\n" + (error.message) + "");
  }
});
