```js
run = (interaction) => {
    if (!interaction.member.permissions.has('MANAGE_GUILD')) return interaction.reply({ content: 'Você não tem permissão para utilizar este comando!', ephemeral: true })

    const subCommandGroup = interaction.options.getSubcommandGroup()
    const subCommand = interaction.options.getSubcommand()

    require(`../../subCommands/config/${subCommandGroup}/${subCommand}`)(this.client, interaction)
}
```