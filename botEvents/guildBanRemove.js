const discord = require('discord.js');
const config = require('../config.json');
const modActionSchema = require('../Database/modActionsSchema');


module.exports = {
	name: 'guildBanRemove',
	async execute(unban, client) {


        const dbModActionsData = await modActionSchema.findOne({
            USER_ID: unban.user.id
        }).exec();


        // MOD LOG CHANNEL
        const modLogChannel = unban.guild.channels.cache.find(ch => ch.name === `mod-log`)
        // MOD ACTIONS CHANNEL
        const modActionsChannel = unban.guild.channels.cache.find(ch => ch.name === `mod-actions`)


        // BAN REASON
        if(unban.reason == null) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`User Ban Removed`)
                .setDescription(`**User:** <@${unban.user.id}>\n**Tag:** ${unban.user.tag}\n**ID:** ${unban.user.id}\n**Reason:** *No reason provided.*\nUse \`\`/reason\`\` to add a reason.`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})

            // DATABASE LOGGING
            await modActionSchema.findOneAndDelete({
                USER_ID: unban.user.id
            }).exec();
        }

        if(unban.reason !== null) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`User Ban Removed`)
                .setDescription(`**User:** <@${unban.user.id}>\n**Tag:** ${unban.user.tag}\n**ID:** ${unban.user.id}\n**Reason:** ${unban.reason}`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})

            // DATABASE LOGGING
            await modActionSchema.findOneAndDelete({
                USER_ID: unban.user.id
            }).exec();
        }

        
        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedOrange)
            .setTitle(`User Ban Removed | Case #${dbModActionsData.CASE_NUM}`)
            .setDescription(`**User:** <@${unban.user.id}>\n**Tag:** ${unban.user.tag}\n**ID:** ${unban.user.id}`)
            .setTimestamp()

        // LOG ENTRY
        modActionsChannel.send({embeds: [logEmbed]})
	},
};