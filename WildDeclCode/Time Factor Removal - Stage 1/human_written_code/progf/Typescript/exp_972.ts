var SlashCommandBuilder = require('@discordjs/builders').SlashCommandBuilder;
var GuildBasedChannel = require('discord.js').GuildBasedChannel;

var InspirationModel = require('../database/models/Inspiration');
var Command = require('../interfaces/Command').Command;
var getDateStamp = require('../modules/getDateStamp').getDateStamp;
var scheduleInspiration = require('../modules/scheduleInspiration').scheduleInspiration;
var errorHandler = require('../utils/errorHandler').errorHandler;

const setup: Command = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Set up your daily inspirations.")
    .addChannelOption(function (option) { return option
        .setName("channel")
        .setDescription("The channel to post inspirations in.")
        .setRequired(true); })
    .addIntegerOption(function (option) { return option
        .setName("utc-hour")
        .setDescription("The hour, **in UTC**, to post your inspiration")
        .setMinValue(0)
        .setMaxValue(23)
        .setRequired(true); }),
  run: async function (interaction, BOT) {
    try {
      await interaction.deferReply();
      var guild = interaction.guild;
var member = interaction.member;
      const targetChannel = interaction.options.getChannel("channel", true);
      const targetHour = interaction.options.getInteger("utc-hour", true);
      if (!guild || !member) {
        await interaction.editReply(
          "Did not receive the guild or member objects. Please try again."
        );
        return;
      }

      if (
        typeof member.permissions === "string" ||
        !member.permissions.has("MANAGE_GUILD")
      ) {
        await interaction.editReply(
          "You do not have the permissions to use this command."
        );
        return;
      }

      if (
        !["GUILD_TEXT", "GUILD_NEWS"].includes(targetChannel.type as string)
      ) {
        await interaction.editReply(
          "The channel you specified is not a text channel."
        );
        return;
      }

      if (
        !guild.me
          ?.permissionsIn(targetChannel as GuildBasedChannel)
          .has("SEND_MESSAGES") ||
        !guild.me
          ?.permissionsIn(targetChannel as GuildBasedChannel)
          .has("EMBED_LINKS")
      ) {
        await interaction.editReply(
          "I do not have the permissions to send messages or embed links in the channel you specified."
        );
        return;
      }

      const serverData =
        (await InspirationModel.findOne({ serverId: guild.id })) ||
        (await InspirationModel.create({
          serverId: guild.id,
          channelId: targetChannel.id,
          hour: targetHour,
        }));

      serverData.channelId = targetChannel.id;
      serverData.hour = targetHour;
      await serverData.save();

      await interaction.editReply(
        "You will receive daily inspirations in <#" + (
          targetChannel.id
        ) + "> at " + (getDateStamp(targetHour)) + "."
      );
      await scheduleInspiration(serverData, BOT);
    } catch (err) {
      errorHandler("setup command", err);
      await interaction.editReply(
        "Something went wrong! Join our support server for assistance: https://chat.nhcarrigan.com"
      );
    }
  },
};
