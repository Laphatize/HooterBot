const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name: `initialprompt`,
    aliases: [`verifprompt1`],
    description: `(${config.emjAdmin}) A demo command to prototype the embed initially sent to a user looking to verify.`,
    expectedArgs: '',
    cooldown: -1,
    minArgs: 0,
    maxArgs: 0,
    guildOnly: false,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

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
            .setStyle("SECONDARY")
            .setCustomId("physical_TUid_Card")
        let VirtualTUidCardButton = new MessageButton()
            .setLabel("Virtual TUid Card")
            .setStyle("SECONDARY")
            .setCustomId("virtual_TUid_Card")
        let TuPortalButton = new MessageButton()
            .setLabel("TUportal")
            .setStyle("SECONDARY")
            .setCustomId("TU_portal")
        let CancelButton = new MessageButton()
            .setLabel("Quit Verification")
            .setStyle("DANGER")
            .setCustomId("quit")


        // BUTTON ROW
        let buttonRow = new MessageActionRow()
            .addComponent(TUidCardButton)
            .addComponent(VirtualTUidCardButton)
            .addComponent(TuPortalButton)
            .addComponent(CancelButton)
        
        // POSTING EMBED MESSAGE AND BUTTON
        await message.channel.send({embeds: [ticketEmbed], components: [buttonRow] });
    }
}