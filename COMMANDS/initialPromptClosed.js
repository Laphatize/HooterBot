const discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    commands: ['initialPromptClosed'],
    expectedArgs: '',
    cooldown: -1,
    permissionError: ``,
    description: `(${config.emjAdmin}) The the embed sent in DMs to verify a user, but now with the buttons disabled (as a test).`,
    minArgs: 0,
    maxArgs: 0,
    callback: async (message, arguments, text, client) => {

        // DELETING INVOCATION MESSAGE
        client.setTimeout(() => message.delete(), 0 );

        // EMBED MESSAGE
        let ticketEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .setTitle(`**Verification - Ticket Opened**`)
            .setDescription(`Thanks for wanting to verify in the <:TempleT:857293539779018773> Temple University server.\nThere are **3** ways to verify:\n- Use a physical TUid card\n- Use a virtual TUid card\n- Using TUportal\n\nSelect a button below to begin.`)
            .setFooter("If these buttons stop working, type \"$initialPrompt\". If it continues to fail, submit a ModMail ticket.")

        // INITIALIZING BUTTON
        let TUidCardButton = new MessageButton()
            .setLabel("Physical TUid Card")
            .setStyle("grey")
            .setID("physical_TUid_Card")
            .setDisabled()
        let VirtualTUidCardButton = new MessageButton()
            .setLabel("Virtual TUid Card")
            .setStyle("grey")
            .setID("virtual_TUid_Card")
            .setDisabled()
        let TuPortalButton = new MessageButton()
            .setLabel("TUportal")
            .setStyle("grey")
            .setID("TU_portal")
            .setDisabled()
        let CancelButton = new MessageButton()
            .setLabel("Quit Verification")
            .setStyle("red")
            .setID("quit")
            .setDisabled()

        let row = new MessageActionRow()
            .addComponent(TUidCardButton)
            .addComponent(VirtualTUidCardButton)
            .addComponent(TuPortalButton)
            .addComponent(CancelButton)
        
        // POSTING EMBED MESSAGE AND BUTTON
        await message.channel.send({ embeds: [ticketEmbed], component: row });
    },
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
}