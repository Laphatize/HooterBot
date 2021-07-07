const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name: `tuidcardprompt`,
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
            **1.** Hold your TUid card up next to your screen with Discord open.\n
            **2.** Take a picture of your card and Discord screen. Make sure the bottom-left corner of Discord is visible that shows your avatar, username, and tag (the # and 4 digits)\n
            **3.** Attach the picture to this DM and send it.\n
            **4.** Wait for a response from a server admin. Responses may take up to 2 days.\n\n
            When this ticket is complete, its contents are permanently deleted. If you have any questions, send them in the chat. If you wish to change the verification method you are using, select a new button from the message above.`)
            .setFooter(`tuidCardPrompt v0.1 - TESTING`)


        // INITIALIZING BUTTON
        let CancelButton = new MessageButton()
            .setLabel("Quit Verification")
            .setStyle("DANGER")
            .setCustomId("quit")


        // BUTTON ROW
        let buttonRow = new MessageActionRow()
            .addComponents(
                TUidCardButton,
                VirtualTUidCardButton,
                TuPortalButton,
                CancelButton
            );
        
        // POSTING EMBED MESSAGE AND BUTTON
        await message.channel.send({embeds: [physicalTuIdEmbed], components: [buttonRow] });
    }
}