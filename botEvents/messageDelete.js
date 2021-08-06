const discord = require('discord.js');
const config = require('../config.json');
const guildSchema = require('../Database/guildSchema');

module.exports = {
	name: 'messageDelete',
	async execute(message, client) {

        // IGNORE NON-GUILD CHANNELS
        if(message.channel.type === 'DM') return;


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


        // LOG EMBED
        let logEmbed = new discord.MessageEmbed()
            .setColor(config.embedOrange)
            .setTitle(`Message Deleted`)
            .addField(`User:`, `${member}`, true)
            .addField(`Tag:`, `${member.user.tag}`, true)
            .addField(`ID:`, `${member.id}`, true)
            .addField(`Time in server:`, `${memberDuration}`)
            .setTimestamp()

        // LOG ENTRY
        modLogChannel.send({embeds: [logEmbed]})
	},
};