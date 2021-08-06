const discord = require('discord.js')
const config = require ('../../config.json')
const guildSchema = require('../../Database/guildSchema')

module.exports = {
    name: 'verif_category',
    description: `ADMIN | Set ticket channel creation category. Cannot modify category once set. [10s]`,
    options: [
        {
            name: `channel`,
            description: `The name of the category.`,
            type: `CHANNEL`,
            required: true,
        },
    ],
    permissions: 'MANAGE_MESSAGES', //ADMINISTRATOR
    cooldown: 10,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        if(interaction.user.id == config.botAuthorId) {
            interaction.reply({ content: `**GuildApplicationCommandData**\n**Slash Command ID:** ${interaction.id}\n**Slash Command Name:** ${interaction.name}`})
        }

        // GRABBING SLASH COMMAND INPUT VALUES
        const categoryId = inputs[0];     // THIS IS THE CHANNEL ID

        // FETCHING CATEGORY
        const category = interaction.guild.channels.cache.find(ch => ch.type == "GUILD_CATEGORY" && ch.id == categoryId);

        // CHECKING INPUT IS A CATEGORY
        if(!category) {
            // DEFINING EMBED
            let notCatEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} You selected a text channel, not a category!`)
                .setDescription(`Sorry, I can't list just categories in that menu (yell at Discord, not me). Be sure the icon of the channel you pick is a folder!`)
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
                .setDescription(`It is not possible to change the ticket category once set, otherwise, the current verification tickets will become invalid.\nIf the current category is reaching capacity, **enable maintenance mode** (\`\`/maintenance\`\`).`)
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
        let logMaintenanceEmbed = new discord.MessageEmbed()
            .setColor(config.embedDarkGrey)
            .setTitle(`Ticket Category Updated`)
            .setDescription(`**New ticket category:** \`\`${category.name.toUpperCase()}\`\`\n**Changed by:** ${categoryChanger}`)
            .setTimestamp()
        
        
        // LOG ENTRY
        interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logMaintenanceEmbed] })
    }
}