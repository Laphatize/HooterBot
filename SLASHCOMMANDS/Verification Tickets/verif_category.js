const discord = require('discord.js')
const config = require ('../../config.json')
const guildSchema = require('../../Database/guildSchema')

module.exports = {
    name: 'verif_category',
    description: `(ADMIN) Set the category for ticket channels to be created. Cannot be used to modify the category.`,
    options: [
        {
            name: `channel`,
            description: `The name of the category.`,
            type: `CHANNEL`,
            required: true,
        },
    ],
    permissions: 'ADMINISTRATOR',
    cooldown: 15,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // GRABBING SLASH COMMAND INPUT VALUES
        const category = inputs[0];

        // CHECKING INPUT IS A CATEGORY
        if(category.type !== "GUILD_CATEGORY") {
            // DEFINING EMBED
            let notCatEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} You selected a channel, not a category!`)
                .setDescription(`It is not possible to filter out text channels at this time. Be sure the icon of the channel you pick is a folder!`)
                .setTimestamp()
            
            // SENDING MESSAGE
            return interaction.reply({ embeds: [notCatEmbed], ephemeral: true })
        }


        // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
        const dbData = await guildSchema.findOne({
            GUILD_ID: interaction.guild.id
        }).exec();


        // CHECKING INPUT IS A CATEGORY
        if(dbData) {
            // DEFINING EMBED
            let noCatChangeEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} A category is already set!`)
                .setDescription(`It is not possible to change the ticket category once set, otherwise, the current verification tickets will become invalid.`)
                .setTimestamp()
            
            // SENDING MESSAGE
            return interaction.reply({ embeds: [noCatChangeEmbed], ephemeral: true })
        }


        // UPDATING DATABASE
        await guildSchema.findOneAndUpdate({
            // CONTENT USED TO FIND UNIQUE ENTRY
            GUILD_NAME: interaction.guild.name,
            GUILD_ID: interaction.guild.id
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


        // SENDING CONFIRMATION
        interaction.reply({ embeds: [catUpdateEmbed], ephemeral: true })


        // DEFINING LOG EMBED
        let logTicketCatUpdateEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`Ticket Category Updated`)
            .setDescription(`**New ticket category:** \`\`${category.name.toUpperCase()}\`\`\n**Changed by:** ${categoryChanger}`)
            .setTimestamp()
        
        
        // LOG ENTRY
        interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [logTicketCatUpdateEmbed] })
    }
}