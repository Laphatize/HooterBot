const discord = require('discord.js');
const config = require('../config.json');
const guildSchema = require('../Database/guildSchema');
const moment = require('moment');

module.exports = {
	name: 'messageDelete',
	async execute(message, client) {





        // IGNORE NON-GUILD CHANNELS, MOD-LOG/RULES/LOGGING CHANNEL
        if(message.channel.type == 'DM' || message.channel.name == `mod-log` || message.channel.name == 'hooterbot-error-logging') return;


        // RULES CHANNEL FOR RULES EMBED
        if(message.channel.id == message.guild.channels.cache.find(ch => ch.name === `rules`).id) {

            // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
            const dbData = await guildSchema.findOne({
                GUILD_ID: message.guild.id
            }).exec();


            // COMPARING DB MSG ID TO THE MSG ID OF THE DELETED
            if(dbData.RULES_MSG_ID === message.id) {
                //IF EQUAL, OVERRIDE MESSAGE ID AND CHANNEL ID FROM DB
                await guildSchema.findOneAndUpdate({
                    GUILD_ID: message.guild.id
                },{
                    RULES_MSG_ID: ""
                },{
                    upsert: true
                }).exec();


                // DEFINING LOG EMBED
                let logRuleMsgIDRemoveEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} Rules message ID has been successfully erased from database.`)
                .setDescription(`A new rules embed can now be sent in any channel.`)


                // LOG ENTRY
                return message.guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [logRuleMsgIDRemoveEmbed]})
                    .catch(err => console.log(err))
            }
        }



        // ROLES CHANNEL FOR VERIFICATION EMBED
        if(message.channel.id == message.guild.channels.cache.find(ch => ch.name === `roles`).id) {
            
            // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
            const dbData = await guildSchema.findOne({
                GUILD_ID: message.guild.id
            }).exec();


            // VERIFICIATION PROMPT
            if(dbData.VERIF_PROMPT_MSG_ID === message.id) {
                //IF EQUAL, OVERRIDE MESSAGE ID AND CHANNEL ID FROM DB
                await guildSchema.findOneAndUpdate({
                    GUILD_ID: message.guild.id
                },{
                    VERIF_PROMPT_MSG_ID: ""
                },{
                    upsert: true
                }).exec();
                
                // DEFINING LOG EMBED
                let logVerifPromptMsgIDRemoveEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} The verification prompt message ID has been successfully erased from database.`)
                .setDescription(`A new verification embed can now be sent in any channel.`)

                // LOG ENTRY
                return message.guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [logVerifPromptMsgIDRemoveEmbed]})
                    .catch(err => console.log(err))
            }
            
            // VERIFIED PERKS MESSAGE
            else if(dbData.VERIF_PERKS_MSG_ID === message.id) {
                //IF EQUAL, OVERRIDE MESSAGE ID AND CHANNEL ID FROM DB
                await guildSchema.findOneAndUpdate({
                    GUILD_ID: message.guild.id
                },{
                    VERIF_PERKS_MSG_ID: ""
                },{
                    upsert: true
                }).exec();
                
                // DEFINING LOG EMBED
                let logVerifPromptMsgIDRemoveEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} The verified perks message ID has been successfully erased from database.`)
                .setDescription(`A new verified perks embed can now be sent in any channel.`)

                // LOG ENTRY
                return message.guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [logVerifPromptMsgIDRemoveEmbed]})
                    .catch(err => console.log(err))
            }
        }


        // LOG CHANNEL
        const modLogChannel = message.guild.channels.cache.find(ch => ch.name === `mod-log`)


        let msgAuthor
        try {
            msgAuthor= message.author.tag
        } catch {
            return
        }
        

        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedRed)
            .setTitle(`Message Deleted`)
            .setAuthor(msgAuthor, message.author.displayAvatarURL({ dynamic:true }))
            .setDescription(`**Channel:** ${message.channel}\n**Message:** ${message.content}`)
            .setTimestamp()

        // LOG ENTRY
        return modLogChannel.send({embeds: [logEmbed]})
	},
};