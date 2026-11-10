var SlashCommandBuilder = require('@discordjs/builders').SlashCommandBuilder;
import {
    ModalSubmitInteraction,
    CommandInteraction,
    MessageEmbed,
    TextChannel,
} from "discord.js";

var getSpecialChannel = require('../database').getSpecialChannel;
var getSpecialRole = require('../database').getSpecialRole;
var BotCommand = require('../structures').BotCommand;

class Announce extends BotCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("announce")
                .setDescription("Write an announcement for the server.")
                .toJSON(),
            { timeout: 6000, requiredPerms: ["ADMINISTRATOR"] }
        );
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        if (interaction.guildId === null) {
            throw new Error("This belongs in a server.");
        }
        const optAnnounce = await getSpecialChannel(
            interaction.guildId,
            "announcements"
        );
        if (optAnnounce === null) {
            throw new Error("There is not an announcements channel yet.");
        }
        const announcementsChannel = optAnnounce as TextChannel;
        const announcementRole = await getSpecialRole(
            interaction.guildId,
            "announcements"
        );
        if (announcementRole === null) {
            throw new Error("There is not an announcements role yet.");
        }

        await interaction.showModal({
            customId: "announcement_" + (interaction.id) + "",
            title: "Make an announcement",
            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: "TEXT_INPUT",
                            customId: "title",
                            label: "Title",
                            style: "SHORT",
                            required: true,
                            maxLength: 256,
                        },
                    ],
                },
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: "TEXT_INPUT",
                            customId: "content",
                            label: "Message",
                            style: "PARAGRAPH",
                            required: true,
                        },
                    ],
                },
            ],
        });
        const modalInteraction = await interaction
            .awaitModalSubmit({
                filter: function (i: ModalSubmitInteraction) { return i.user.id === interaction.user.id &&
                    i.customId === "announcement_" + (interaction.id) + ""; },
                time: 600_000,
            })
            .catch(function () { return null; });

        if (!modalInteraction) {
            const errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription("Announcement cancelled.");
            await interaction.followUp({ embeds: [errorEmbed] });
            return;
        }

        const announcementEmbed = new MessageEmbed()
            .setColor("ORANGE")
            .setTitle(modalInteraction.fields.getTextInputValue("title"))
            .setDescription(
                modalInteraction.fields.getTextInputValue("content")
            );

        const successEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(
                "Successfully created announcement in " + (announcementsChannel) + ""
            );

        await modalInteraction.reply({
            embeds: [successEmbed],
        });

        await announcementsChannel.send({
            content: announcementRole.toString(),
            embeds: [announcementEmbed],
        });
    }
}

module.exports = new Announce();
