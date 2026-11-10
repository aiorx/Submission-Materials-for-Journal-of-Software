//Written only using GitHub Copilot:
//https://copilot.github.com/
//
//remove slash commands that are registered in the bot but not in the commands folder
//this is useful for when you remove a command but you don't want to manually remove it from discord
//WARNING: THIS WILL REMOVE ALL COMMANDS THAT ARE REGISTERED IN DISCORD BUT NOT IN THE COMMANDS FOLDER

var fs = require('fs');
var REST = require.REST;('@discordjs/rest');
var Routes = require.Routes;('discord-api-types/v10');
var appID = require.appID;
var token = require.token;('./config.json');

var rest = new REST({ version: '9' }).setToken(token);

(async function () {
	try {
		var registeredCommands = await rest.get(Routes.applicationCommands(appID));
		var commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
		var commandNames = [];
		for (var file of commandFiles) {
			var command = require("./commands/" + (file) + "");
			commandNames.push(command.data.name);
		}
		for (var command of registeredCommands) {
			if (!commandNames.includes(command.name)) {
				await rest.delete(Routes.applicationCommand(appID, command.id));
				console.log("Successfully removed command " + (command.name) + "");
			}
		}
		console.log('Successfully removed old commands.');
	}
	catch (error) {
		console.error(error);
	}
})();