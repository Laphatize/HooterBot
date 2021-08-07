const discord = require('discord.js')
const config = require ('../../config.json')

// COMMAND ID: 871240034152501263

module.exports = {
    name: 'sponsor',
    description: `Info on supporting the development and operations of ${config.botName}. [60s]`,
    options: [],
    permissions: '',
    cooldown: 60,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // CREATING EMBED FOR RESPONSE        
        let infoEmbed = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`**Support HooterBot!**`)
            .setDescription(`${config.botName} relies on a database connection for functionality. As ${config.botName} grows with new features, costs to keep the bot online will be incurred.
            \nLike ${config.botName}? Want to support ${config.botName}'s development and operations? Check out ${config.botAuthorUsername}'s GitHub Sponsor page:`)
            .addField(`GitHub Sponsor Page`, `https://github.com/sponsors/MrMusicMan789`)
            .setThumbnail('https://avatars.githubusercontent.com/u/58273574?v=4')


        // POST EMBED
        interaction.reply({ embeds: [infoEmbed] })
    }
}