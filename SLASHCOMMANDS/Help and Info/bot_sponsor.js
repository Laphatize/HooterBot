const discord = require('discord.js')
const config = require ('../../config.json')


module.exports = {
    data: new SlashCommandBuilder()
    .setName('bot_sponsor')
    .setDescription(`Info on how you can support the development and operations of ${config.botName}. [60s]`)
}

//     name: 'bot_sponsor',
//     description: `Info on supporting the development and operations of ${config.botName}. [60s]`,
//     options: [],
//     permissions: '',
//     dmUse: true,
//     cooldown: 60,
//     defaultPermission: true,
//     run: async(client, interaction, inputs) => {

//         // CREATING EMBED FOR RESPONSE        
//         let infoEmbed = new discord.MessageEmbed()
//             .setColor(config.embedBlurple)
//             .setTitle(`**Support HooterBot!**`)
//             .setDescription(`${config.botName} relies on a database connection for functionality. As ${config.botName} grows with new features, costs to keep the bot online will be incurred.
//             \nLike ${config.botName}? Want to support ${config.botName}'s development and operations? Check out ${config.botAuthorUsername}'s GitHub Sponsor page:`)
//             .addField(`GitHub Sponsor Page`, `https://github.com/sponsors/MrMusicMan789`)
//             .setThumbnail('https://avatars.githubusercontent.com/u/58273574?v=4')


//         // POST EMBED
//         interaction.reply({ embeds: [infoEmbed] })
//     }
// }