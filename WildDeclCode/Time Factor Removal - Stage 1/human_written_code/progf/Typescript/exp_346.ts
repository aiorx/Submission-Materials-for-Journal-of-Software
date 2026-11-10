var GuildChannel = require('eris').GuildChannel;
var ICommandContext = require('knub').ICommandContext;
var TypeConversionError = require('knub-command-manager').TypeConversionError;
var convertDelayStringToMS = require('./utils').convertDelayStringToMS;
var disableCodeBlocks = require('./utils').disableCodeBlocks;
var resolveMember = require('./utils').resolveMember;
var resolveUser = require('./utils').resolveUser;
var UnknownUser = require('./utils').UnknownUser;

const customArgumentTypes = {
  delay(value) {
    const result = convertDelayStringToMS(value);
    if (result == null) {
      throw new TypeConversionError("Could not convert " + (value) + " to a delay");
    }

    return result;
  },

  async resolvedUser(value, context: ICommandContext) {
    const result = await resolveUser(context.bot, value);
    if (result == null || result instanceof UnknownUser) {
      throw new TypeConversionError("User \`" + (disableCodeBlocks(value)) + "\` was not found");
    }
    return result;
  },

  async resolvedUserLoose(value, context: ICommandContext) {
    const result = await resolveUser(context.bot, value);
    if (result == null) {
      throw new TypeConversionError("Invalid user: \`" + (disableCodeBlocks(value)) + "\`");
    }
    return result;
  },

  async resolvedMember(value, context: ICommandContext) {
    if (!(context.message.channel instanceof GuildChannel)) return null;

    const result = await resolveMember(context.bot, context.message.channel.guild, value);
    if (result == null) {
      throw new TypeConversionError(
        "Member \`" + (disableCodeBlocks(value)) + "\` was not found or they have left the server",
      );
    }
    return result;
  },
};
