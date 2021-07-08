const discord = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name: `staff`,
    aliases: [``],
    description: `Generates a list of current server staff for the Temple University Discord server.`,
    expectedArgs: '',
    cooldown: 60,
    minArgs: 0,
    maxArgs: 0,
    guildUse: true,
    dmUse: true,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        // CREATING EMBED FOR RESPONSE        
        let serverStaffList = new discord.MessageEmbed()
        .setColor(config.embedBlurple)
        .setTitle(`**Server Staff**`)
        .addField(`${config.emjAdmin}Admins:`, `<@400071708947513355>   <@694391619868295241>   <@472185023622152203>`)
        .addField(`${config.emjModerator} Moderators:`, `<@626143139639459841>   <@338762061502873600>   <@446818962760531989>   <@270661345588936715>   <@418870468955602944>`)


        // POST EMBED
        await message.reply({embeds: [serverStaffList] })
        .catch(err => console.log(err))
        return;
    }
}