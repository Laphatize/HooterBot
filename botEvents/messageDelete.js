const discord = require('discord.js');
const config = require('../config.json');
const guildSchema = require('../Database/guildSchema');

module.exports = {
	name: 'messageDelete',
	async execute(message, client) {

        // FILTER TO THE RULES OR ROLES CHANNELS
        if (message.channel.id == config.rulesChannelId || message.channel.id == config.rolesChannelId) {

            // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
            const dbData = await guildSchema.findOne({
                GUILD_ID: message.guild.id
            }).exec();

            // RULES CHANNEL FOR RULES EMBED
            if(message.channel.id == config.rulesChannelId) {
                console.log(`The message's channel ID matches the Rules channel ID. Comparing message IDs...`)

                // COMPARING DB MSG ID TO THE MSG ID OF THE DELETED
                if(dbData.RULES_MSG_ID === message.id) {
                    //IF EQUAL, OVERRIDE MESSAGE ID AND CHANNEL ID FROM DB
                    await guildSchema.findOneAndUpdate({
                        GUILD_ID: message.guild.id
                    },{
                        RULES_CH_ID: "",
                        RULES_MSG_ID: ""
                    },{
                        upsert: true
                    }).exec();

                    console.log(`The rules embed has been removed from ${message.channel.name} and its database entry removed.`)

                    // DEFINING LOG EMBED
                    let logRuleMsgIDRemoveEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} Rules message ID has been successfully erased from database.`)
                    .setDescription(`A new rules embed can now be sent in any channel.`)

                    // LOG ENTRY
                    client.channels.cache.get(config.logActionsChannelId).send({embeds: [logRuleMsgIDRemoveEmbed]})
                        .catch(err => console.log(err))
                } else {
                    // THIS ISN'T A MESSAGE THE BOT NEEDS TO FUNCTION
                    return;
                }
                console.log(`Message ID's did not match, no action taken.`)
                return;
            }

            // ROLES CHANNEL FOR VERIFICATION EMBED
            if(message.channel.id == config.rolesChannelId) {
                console.log(`The message's channel ID matches the Roles channel ID. Comparing message IDs...`)

                // COMPARE DB MSG ID TO DELETED MESSAGE ID
                if(dbData.VERIF_PROMPT_MSG_ID === message.id) {
                    //IF EQUAL, OVERRIDE MESSAGE ID AND CHANNEL ID FROM DB
                    await guildSchema.findOneAndUpdate({
                        GUILD_ID: message.guild.id
                    },{
                        VERIF_PROMPT_CH_ID: "",
                        VERIF_PROMPT_MSG_ID: ""
                    },{
                        upsert: true
                    }).exec();

                    console.log(`The Verification Prompt has been removed from ${message.channel.name}.`)
                    
                    // DEFINING LOG EMBED
                    let logVerifPromptMsgIDRemoveEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} The verification prompt message ID has been successfully erased from database.`)
                    .setDescription(`A new verification embed can now be sent in any channel.`)

                    // LOG ENTRY
                    client.channels.cache.get(config.logActionsChannelId).send({embeds: [logVerifPromptMsgIDRemoveEmbed]})
                        .catch(err => console.log(err))
                } else {
                    // THIS ISN'T A MESSAGE THE BOT NEEDS TO FUNCTION
                    return;
                }
                console.log(`Message ID's did not match, no action taken.`)
                return;
            }
        }
    }
}