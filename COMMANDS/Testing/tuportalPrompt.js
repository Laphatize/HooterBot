const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name: `tuportalprompt`,
    aliases: [`verifprompt4`],
    description: `(${config.emjAdmin}) A demo command to prototype the embed initially sent to a user looking to verify.`,
    expectedArgs: '',
    cooldown: -1,
    minArgs: 0,
    maxArgs: 0,
    guildUse: true,
    dmUse: true,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, prefix, client) => {

        // DELETING INVOCATION MESSAGE
        client.setTimeout(() => message.delete(), 0 );


        // EMBED MESSAGE
        let physicalTuIdEmbed = new discord.MessageEmbed()
            .setColor(config.embedTempleRed)
            .setTitle(`**Using TUportal**`)
            .setDescription(`To verify using TUportal:\n
            ${config.indent}**1.** Log in to [TUportal](https://tuportal5.temple.edu/). Click the \`\`Student Tools\`\` tab. Your student dashboard will appear in the center of the screen.\n
            ${config.indent}**2.** Put the window showing your virtual TUid next to Discord and take a picture. Make sure the bottom-left corner of Discord is visible that shows your avatar, username, and tag.\n
            ${config.indent}***Note:** If you have a custom status set, you'll need to hover your mouse over the section so your tag is visible.*\n
            ${config.indent}**3.** Reply to this message below with the picture as an attachment. **Please obscure any personally identifiable information (pictures, names) you wish to not share before sending.**\n
            ${config.indent}**4.** Wait for a response from a server admin. Responses may take up to 2 days.\n\n
            When this ticket is complete, its contents are permanently deleted. If you have any questions, please send them in the chat below. If you wish to change verification methods, select a different button in the message above.\n`)
            .setFooter(`tuportalPrompt v0.1 - TESTING`)


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