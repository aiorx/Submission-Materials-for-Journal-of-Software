//Written only using GitHub Copilot:
//https://copilot.github.com/
//
//remove slash commands that are registered in the bot but not in the commands folder
//this is useful for when you remove a command but you don't want to manually remove it from discord
//WARNING: THIS WILL REMOVE ALL COMMANDS THAT ARE REGISTERED IN DISCORD BUT NOT IN THE COMMANDS FOLDER

const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { appID, token } = require('./config.json');

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		const registeredCommands = await rest.get(Routes.applicationCommands(appID));
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
		const commandNames = [];
		for (const file of commandFiles) {
			const command = require(`./commands/${file}`);
			commandNames.push(command.data.name);
		}
		for (const command of registeredCommands) {
			if (!commandNames.includes(command.name)) {
				await rest.delete(Routes.applicationCommand(appID, command.id));
				console.log(`Successfully removed command ${command.name}`);
			}
		}
		console.log('Successfully removed old commands.');
	}
	catch (error) {
		console.error(error);
	}
})();