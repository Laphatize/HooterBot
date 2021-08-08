const discord = require('discord.js');
const config = require('../config.json');
const guildSchema = require('../Database/guildSchema');

module.exports = {
	name: 'messageDelete',
	async execute(message, client) {

        // IGNORE NON-GUILD CHANNELS
        if(message.author.bot || !message.guild) return;


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
                message.guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [logRuleMsgIDRemoveEmbed]})
                    .catch(err => console.log(err))
            } else {
                // THIS ISN'T A MESSAGE THE BOT NEEDS TO FUNCTION
                return;
            }
            return;
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
                message.guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [logVerifPromptMsgIDRemoveEmbed]})
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
                message.guild.channels.cache.find(ch => ch.name === `mod-log`).send({embeds: [logVerifPromptMsgIDRemoveEmbed]})
                    .catch(err => console.log(err))

            } else {
                // THIS ISN'T A MESSAGE THE BOT NEEDS TO FUNCTION
                return;
            }
            return;
        }



        // IGNORE MOD-LOG CHANNEL DELETIONS
        if(message.channel.name == `mod-log` || message.channel.name == `rules` || message.channel.id == '870150164432687135') return;


        // DELAY FOR AUDIT LOG TO UPDATE
        await discord.Util.delayFor(900);


        // FETCHING RECENT AUDIT LOGS
        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 5,
            type: 'MESSAGE_DELETE'
        }).catch(err => console.log(err))

        const auditEntry = fetchedLogs.entries.find(a =>
            // FILTER
            a.target.id === message.author.id &&
            a.extra.channel.id === message.channel.id &&
            Date.now() - a.createdTimestamp < 20000         // IGNORING ENTRIES OLDER THAN 20s
        )

        if(!auditEntry) return;
        
        const { executor, target } = auditEntry
        

        // LOG CHANNEL
        const modLogChannel = message.guild.channels.cache.find(ch => ch.name === `mod-log`)


        if(target.id === message.author.id) {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedOrange)
                .setTitle(`Message Deleted`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic:true }))
                .setDescription(`**Channel:** ${message.channel}\n**Message:** ${message.content}`)
                .setFooter(`Message deleted by user.`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        } else {
            // LOG EMBED
            let logEmbed = new discord.MessageEmbed()
                .setColor(config.embedOrange)
                .setTitle(`Message Deleted`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic:true }))
                .setDescription(`**Channel:** ${message.channel}\n**Message:** ${message.content}`)
                .setFooter(`Message deleted by: ${executor.tag}`)
                .setTimestamp()

            // LOG ENTRY
            modLogChannel.send({embeds: [logEmbed]})
        }
	},
};