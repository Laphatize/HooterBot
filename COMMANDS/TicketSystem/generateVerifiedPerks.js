const discord = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name: `verifyPerksEmbed`,
    aliases: [`verifyPerks`, `whyVerify`],
    description: `(${config.emjAdmin}) Generate the embed in the \#roles channel so users can view the list of perks for verifying.`,
    expectedArgs: '',
    cooldown: -1,
    minArgs: 0,
    maxArgs: 0,
    guildOnly: true,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        // DELETING INVOCATION MESSAGE
        client.setTimeout(() => message.delete(), 0 );

        
        // IGNORING DM USE
        if(message.channel.type == "dm") {
            return;
        }
        
        
        // EMBED MESSAGE
        let ticketEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`**Why Verify?**`)
            .setDescription(`Students, alumni, and employee of Temple University gain access to additional channels and permissions in the server:`)
            .addField(`Image posting and GIF embed:`, "*Server-wide* - non-verified users can only post/embed in:\n• <#829409161581821999>\n• <#831152843166580777>\n• <#832649518079672340>")
            .addField(`Channel access:`, `• <#829445602868854804> - find roommates for the upcoming term\n• <#831527136438255626> - connect with each other on social media\n• <#832976391985168445> - discuss scheduling and classes\n• <#829629393629872159> - talk about IRL events happening`)
            .addField(`Posting abilities:`, `• <#829732282079903775>`)
            .addField(`Voice chat features:`, `• Screen sharing`)

        // POSTING EMBED MESSAGE AND BUTTON
        await message.channel.send({embeds: [ticketEmbed]});
    }
}