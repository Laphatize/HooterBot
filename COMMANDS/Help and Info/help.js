const discord = require('discord.js')
const config = require ('../../config.json')
const guildSchema = require('../../Database/guildSchema');

module.exports = {
    name: `help`,
    aliases: [`commands`],
    description: `Describes ${config.botName}'s commands. (🗺️📌 *You are here*)`,
    expectedArgs: '',
    cooldown: 60,
    minArgs: 0,
    maxArgs: 0,
    guildUse: true,
    dmUse: false,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, prefix, client) => {

        // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
        const dbData = await guildSchema.findOne({
            GUILD_ID: message.guild.id
        });


		let offlineEmbed = new discord.MessageEmbed()
            .setColor(config.embedRed)
            .setTitle(`${config.emjREDTICK} Error!`)
            .setDescription(`Sorry, this command is offline right now as MMM works on building a new, better version.`)
            message.channel.send({embeds: [offlineEmbed]})
			// DELETE AFTER 10 SECONDS
            .then(msg => {client.setTimeout(() => msg.delete(), 10000 )})
            .catch(err => console.log(err))
            return
	}
}