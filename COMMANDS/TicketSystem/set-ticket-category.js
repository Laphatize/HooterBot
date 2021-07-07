const discord = require('discord.js')
const guildSchema = require('../../Database/guildSchema')
const config = require('../../config.json');

module.exports = {
    name: `setTicketCategory`,
    aliases: [`setcategory`, `ticketCategory`, `ticketCat`],
    description: `(${config.emjAdmin}) Manually set the category where verification tickets are created.`,
    expectedArgs: '<Category name>',
    cooldown: -1,
    minArgs: 1,
    maxArgs: 1,
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

        
        let categoryChanger = message.author;

        const category = message.guild.channels.cache.find(ch => ch.type == "category" && ch.name.toLowerCase() == arguments[0].toLowerCase());
        

        // IF NO CATEGORY PROVIDED
        if(!category) {
            let noCatEmbed = new discord.MessageEmbed()
            .setColor(config.embedRed)
            .setTitle(`${config.emjREDTICK} Please make sure the name provided is a category that exists.)`)

            return message.channel.send({embeds: [noCatEmbed]})
        }


        // UPDATING DATABASE
        await guildSchema.findOneAndUpdate({
            // CONTENT USED TO FIND UNIQUE ENTRY
            GUILD_NAME: message.guild.name,
            GUILD_ID: message.guild.id
        }, {
            // CONTENT TO BE UPDATED
            TICKET_CAT_ID: category.id
        }, {
            upsert: true
        })


        // DEFINING UPDATE EMBED
        let catUpdateEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`${config.emjGREENTICK} The category has been set to \`\`${category.name}\`\`.`)


        // SENDING EMBED
        message.channel.send({embeds: [catUpdateEmbed]})


        // DEFINING LOG EMBED
        let logTicketCatUpdateEmbed = new discord.MessageEmbed()
        .setColor(config.embedDarkGrey)
        .setTitle(`Ticket Category Updated`)
        .setDescription(`**New ticket category:** \`\`${category.name}\`\`\n**Changed by:** ${categoryChanger}`)
        .setTimestamp()
        
        
        // LOG ENTRY
        client.channels.cache.get(config.logActionsChannelId).send({embeds: [logTicketCatUpdateEmbed]})
    }
}