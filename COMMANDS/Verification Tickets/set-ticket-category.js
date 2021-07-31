const discord = require('discord.js')
const guildSchema = require('../../Database/guildSchema')
const config = require('../../config.json');

module.exports = {
    name: `setticketcategory`,
    aliases: [`setcategory`],
    description: `(${config.emjAdmin}) Manually set the category where verification tickets are created.`,
    category: `Verification`,
    expectedArgs: '<Category name>',
    cooldown: 15,
    minArgs: 1,
    maxArgs: 1,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, client) => {
        
        // DELETING INVOCATION MESSAGE
        setTimeout(() => message.delete(), 0 );


        // GRABBING FULL ARGS
        const combinedArgs = arguments.join(' ')

        
        let categoryChanger = message.author;

        const category = message.guild.channels.cache.find(ch => ch.type == "GUILD_CATEGORY" && ch.name.toLowerCase() == combinedArgs.toLowerCase());
        

        // IF NO CATEGORY PROVIDED
        if(!category) {
            let noCatEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Please make sure the name provided is a category that exists.`)

            return message.channel.send({embeds: [noCatEmbed]})
            // DELETE AFTER 10 SECONDS
                .then(msg => {setTimeout(() => msg.delete(), 10000 )})
                .catch(err => console.log(err))
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
        }).exec();


        // DEFINING UPDATE EMBED
        let catUpdateEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`${config.emjGREENTICK} The category has been set to \`\`${category.name.toUpperCase()}\`\`.`)


        // SENDING EMBED
        message.channel.send({embeds: [catUpdateEmbed]})
            // DELETE AFTER 10 SECONDS
            .then(msg => {setTimeout(() => msg.delete(), 10000 )})
            .catch(err => console.log(err))


        // DEFINING LOG EMBED
        let logTicketCatUpdateEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`Ticket Category Updated`)
            .setDescription(`**New ticket category:** \`\`${category.name.toUpperCase()}\`\`\n**Changed by:** ${categoryChanger}`)
            .setTimestamp()
        
        
        // LOG ENTRY
        message.guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [logTicketCatUpdateEmbed]})
    }
}