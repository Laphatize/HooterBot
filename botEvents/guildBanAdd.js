const discord = require('discord.js');
const config = require('../config.json');
const modActionSchema = require('../Database/modActionsSchema');


module.exports = {
	name: 'guildBanAdd',
	async execute(ban, client) {

        // GET CASE NUMBER FROM CURRENT COUNT OF ENTRIES
        let caseNum = modActionsSchema.count()+1


        // MOD LOG CHANNEL
        const modLogChannel = ban.guild.channels.cache.find(ch => ch.name === `mod-log`)
        // MOD ACTIONS CHANNEL
        const modActionsChannel = ban.guild.channels.cache.find(ch => ch.name === `mod-actions`)


        // BAN REASON
        if(ban.reason == null) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`User Banned`)
                .setDescription(`**User:** <@${ban.user.id}>\n**Tag:** ${ban.user.tag}\n**ID:** ${ban.user.id}\n**Reason:** *No reason provided.*\nUse \`\`/reason\`\` to add a reason.`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})

            // DATABASE LOGGING
            modActionSchema.findOneAndUpdate({
                USER_ID: ban.user.id
            },{
                USER_ID: ban.user.id,
                ACTION: `Ban`,
                REASON: "",
                CASE_NUM: caseNum,
                MOD_ID: "",
            },{
                upsert: true
            }).exec();
        }

        if(ban.reason !== null) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`User Banned`)
                .setDescription(`**User:** <@${ban.user.id}>\n**Tag:** ${ban.user.tag}\n**ID:** ${ban.user.id}\n**Reason:** ${ban.reason}`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})

            // DATABASE LOGGING
            modActionSchema.findOneAndUpdate({
                USER_ID: ban.user.id
            },{
                USER_ID: ban.user.id,
                ACTION: `Ban`,
                REASON: ban.reason,
                CASE_NUM: caseNum,
                MOD_ID: "",
            },{
                upsert: true
            }).exec();
        }


        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedRed)
            .setTitle(`User Banned | Case #${caseNum}`)
            .setDescription(`**User:** <@${ban.user.id}>\n**Tag:** ${ban.user.tag}\n**ID:** ${ban.user.id}\n**Reason:** ${ban.reason}`)
            .setTimestamp()

        // LOG ENTRY
        msg = modActionsChannel.send({embeds: [logEmbed]})


        // DATABASE LOGGING OF MESSAGE ID
        modActionSchema.findOneAndUpdate({
            USER_ID: ban.user.id
        },{
            MODACTIONS_MSGID: msg.id
        }).exec();
	},
};