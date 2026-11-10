var Discord = require('discord.js');

export type Command = function (message: Discord.Message, ...args: string[]) { return Promise<void> | void; };