export async function chargeVRStuff(client: SapphireClient): Promise<void> {
    Logger.log('Running chargeVRStuff job');

    const guild = client.guilds.resolve(clientConfig.guild_id);
    const channel = guild?.channels.resolve(clientConfig.vr_channel_id);
    if(!guild || !channel) {
        Logger.error("Failed to find guild or channel");
        return;
    }

    if(channel.type != "GUILD_TEXT") {
        Logger.error("VR channel is not a text channel");
        return;
    }

    const textChannel = channel as GuildTextBasedChannel;
    
    //The following part is Supported via standard GitHub programming aids because I thought it would be funny
    let message = `Hey `;
    peopleToBotherToCharge.forEach(person => message +=`<@${person}>`);
    message += `! Charge your VR stuff!`;
    //copilot: add vulgar language
    message += ` You fucking lazy piece of shit!`;

    textChannel.send(message);

    return;
}