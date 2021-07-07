const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name: `physicaltuidcardprompt`,
    aliases: [`verifprompt2`],
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
        let physicalTuIdEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .setTitle(`**Physical TUid Card**`)
            .setDescription(`To verify with a physical TUiD card:\n
            ${config.indent}**1.** Hold your TUid card up next to your screen with Discord open.\n
            ${config.indent}**2.** Take a picture of your card and Discord screen. Make sure the bottom-left corner of Discord is visible so your avatar, username, and tag are visible.\n
            ${config.indent}***Note:** If you have a custom status set, you'll need to hover your mouse over the section so your tag is visible.*\n
            ${config.indent}**3.** Reply to this message below with the picture as an attachment. **Please obscure any personally identifiable information (pictures, names) you wish to not share before sending.**\n
            ${config.indent}**4.** Wait for a response from server staff. Responses may take up to 2 days.\n\n
            When this ticket is complete, its contents are permanently deleted. If you have any questions, please send them in the chat below. If you wish to change verification methods, select a different button in the message above.`)
            .setFooter(`physicalTuidCardPrompt v0.2 - TESTING`)


        // INITIALIZING BUTTON
        let CancelButton = new MessageButton()
            .setLabel("Quit Verification")
            .setStyle("DANGER")
            .setCustomId("quit")


        // BUTTON ROW
        let buttonRow = new MessageActionRow()
            .addComponents(
                CancelButton
            );
        
        // POSTING EMBED MESSAGE AND BUTTON
        await message.channel.send({embeds: [physicalTuIdEmbed], components: [buttonRow] });
    }
}