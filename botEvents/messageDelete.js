const discord = require('discord.js')
const config = require('../config.json')
const guildSchema = require('../Database/guildSchema')

module.exports = {
	name: 'messageDelete',
	async execute(message, client) {

        console.log(`A message has been deleted.`)

        // FILTER TO THE RULES OR ROLES CHANNELS
        if (message.channel.id == config.rulesChannelId || message.channel.id == config.rolesChannelId) {

            // LOGGING TEST
            if(message.channel.id == config.rulesChannelId) console.log(`This message is in the rules channel.\nMessage ID: ${message.id}`)
            if(message.channel.id == config.rolesChannelId) console.log(`This message is in the roles channel.\nMessage ID: ${message.id}`)


            // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
            try {
                const dbData = await guildSchema.findOne({
                    GUILD_ID: message.guild.id
                }).exec();
            } catch (err) {
                console.log(err);
            }

            // RULES CHANNEL FOR RULES EMBED
            if(message.channel.id == config.rulesChannelId) {
                console.log(`The message's channel ID matches the Rules channel ID.`)
                
                // IF RULES MESSAGE ID DOES NOT EXIST
                if(!dbData.RULES_MSG_ID) {
                    // DEFINING LOG EMBED
                    let logDbFetchErrorEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Error: unable to fetch value from database.`)
                    .addField(`Channel:`, `${message.channel}`)
                    .addField(`User:`, `${message.author}`)
                    .addField(`Database value sought:`, `\`\`RULES_MSG_ID\`\``)
                    .addField(`Action:`, `Fetch message ID so database value can be removed so a new prompt can be made.`)

                    // LOG ENTRY
                    client.channels.cache.get(config.logActionsChannelId).send({embeds: [logDbFetchErrorEmbed]})
                        .catch(err => console.log(err))
                    return;
                }

                // IF RULES MESSAGE ID ALREADY EXISTS
                if(dbData.RULES_MSG_ID) {
                    // COMPARING DB MSG ID TO THE MSG ID OF THE DELETED
                    if(dbData.RULES_MSG_ID === message.id) {
                        //IF EQUAL, OVERRIDE MESSAGE ID AND CHANNEL ID FROM DB
                        await guildSchema.findOneAndUpdate({
                            GUILD_ID: message.guild.id
                        },{
                            RULES_CH_ID: null,
                            RULES_MSG_ID: null
                        },{
                            upsert: true
                        }).exec();

                        console.log(`The rules embed has been removed from ${message.channel.name} and its database entry removed.`)

                        // DEFINING LOG EMBED
                        let logRuleMsgIDRemoveEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGreen)
                        .setTitle(`${config.emjGREENTICK} Rules message ID has been successfully erased from database.`)
                        .setDescription(`A new rules embed can now be sent in any channel. This action is due to the original message's deletion.`)

                        // LOG ENTRY
                        client.channels.cache.get(config.logActionsChannelId).send({embeds: [logRuleMsgIDRemoveEmbed]})
                            .catch(err => console.log(err))
                    }
                } else {
                    // THIS ISN'T A MESSAGE THE BOT NEEDS TO FUNCTION
                    return;
                }
            }

            // ROLES CHANNEL FOR VERIFICATION EMBED
            if(message.channel.id == config.rolesChannelId) {
                console.log(`The message's channel ID matches the Roles channel ID.`)

                // IF ROLES MESSAGE ID DOES NOT EXIST
                if(!dbData.VERIF_PROMPT_MSG_ID) {
                    // DEFINING LOG EMBED
                    let logDbFetchErrorEmbed = new discord.MessageEmbed()
                    .setColor(config.embedRed)
                    .setTitle(`${config.emjREDTICK} Error: unable to fetch value from database.`)
                    .addField(`Channel:`, `${message.channel}`)
                    .addField(`User:`, `${message.author}`)
                    .addField(`Database value sought:`, `\`\`VERIF_PROMPT_MSG_ID\`\``)
                    .addField(`Action:`, `Fetch message ID so database value can be removed so a new prompt can be made.`)

                    // LOG ENTRY
                    client.channels.cache.get(config.logActionsChannelId).send({embeds: [logDbFetchErrorEmbed]})
                        .catch(err => console.log(err))
                    return;
                }

                // IF RULES MESSAGE ID ALREADY EXISTS
                if(dbData.VERIF_PROMPT_MSG_ID) {
                    // COMPARE DB MSG ID TO DELETED MESSAGE ID
                    if(dbData.VERIF_PROMPT_MSG_ID === message.id) {
                        //IF EQUAL, OVERRIDE MESSAGE ID AND CHANNEL ID FROM DB
                        await guildSchema.findOneAndUpdate({
                            GUILD_ID: message.guild.id
                        },{
                            VERIF_PROMPT_CH_ID: null,
                            VERIF_PROMPT_MSG_ID: null
                        },{
                            upsert: true
                        }).exec();

                        console.log(`The Verification Prompt has been removed from ${message.channel.name}.`)
                        
                        // DEFINING LOG EMBED
                        let logVerifPromptMsgIDRemoveEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGreen)
                        .setTitle(`${config.emjGREENTICK} The verification prompt message ID has been successfully erased from database.`)
                        .setDescription(`A new rules embed can now be sent in any channel. This action is due to the original message's deletion.`)

                        // LOG ENTRY
                        client.channels.cache.get(config.logActionsChannelId).send({embeds: [logVerifPromptMsgIDRemoveEmbed]})
                            .catch(err => console.log(err))
                    } else {
                        // THIS ISN'T A MESSAGE THE BOT NEEDS TO FUNCTION
                        return;
                    }
                }
            }
        }
    }
}