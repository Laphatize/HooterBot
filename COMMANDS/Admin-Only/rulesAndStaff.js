const discord = require('discord.js')
const config = require('../../config.json')
const guildSchema = require('../../Database/guildSchema');

module.exports = {
    name: `rules`,
    aliases: [`rulesembed`, `rulesandstaff`],
    description: `Generates a list of current server staff for the Temple University Discord server.`,
    category: `Administrator`,
    expectedArgs: '',
    cooldown: 10,
    minArgs: 0,
    maxArgs: 0,
    guildUse: true,
    dmUse: false,
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        // DELETING INVOCATION MESSAGE
        client.setTimeout(() => message.delete(), 0 );


        // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
        const dbData = await guildSchema.findOne({
            GUILD_ID: message.guild.id
        }).exec();


        // MAIN RULES EMBED
        let rules = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle('**Rules**')
            .addField(`1. Communicate in English`, `All communication within the server needs to be in English.`)
            .addField(`2. Be respectful of all members`, `We have zero tolerance for discriminatory rhetoric, racism, sexism, homophobia, transphobia, or any other kind of offensive language. The use of inappropriate language and profanity should be kept to a minimum. Derogatory language and slurs are prohibited. This includes usernames, nicknames, and statuses`)
            .addField(`3. No spam, mention spamming, or ghost pinging`, `This includes excessive use of text, emojis, GIFs, and reactions. Ghost pinging is tagging a user then deleting the message for the sake of pinging and frustrating users.`)
            .addField(`4. Keep channels on-topic`, `If discussion is not relevant to the channel, consider taking it to <#829409161581821997> or <#829409161581822000>. All memes must go in <#829409161581821999>. Mods reserve the right to delete messages that do not fit the channel subject.`)
            .addField(`5. No NSFW material or discussions that may cause hostility`, `Explicit content/porn is not allowed ANYWHERE in the server. Discussions about politics, religion or anything that may cause hostility are prohibited.`)
            .addField(`6. No advertising`, `This includes ads for other communities, streams, or goods. Verified users may post student opportunities in <#829732282079903775>. DM advertising is strictly prohibited and will result in an immediate ban.`)
            .addField(`7. No server raiding`, `Discussion of raids or participating in raids is not allowed.`)
            .addField(`8. Abide by Discord's Community Guidelines and Terms of Service (ToS)`, `[Community Guidelines](https://discord.com/guidelines) & [Terms of Service](https://discord.com/terms)`)
            .addField(`9. Moderator and Admin decisions are final`, `Decisions are made at the moderation team's discretion based on evidence and context of a situation.`)
            .addField(`10. Multiple warnings will result in mutes and eventual bans`, `The admins and moderators reserve discretion in expediting this process based on the severity of a situation.`)

        // SERVER STAFF EMBED
        let serverStaffList = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`**Server Staff**`)
            .addField(`${config.emjAdmin} Admins:`, `<@400071708947513355>, <@694391619868295241>, <@472185023622152203>`)
            .addField(`${config.emjModerator} Moderators:`, `<@626143139639459841>, <@338762061502873600>, <@446818962760531989>, <@270661345588936715>, <@418870468955602944>`)

        // MODMAIL INSTRUCTIONS EMBED
        let ModmailHelp = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`**Need help?**`)
            .setDescription(`If you need to speak with a member of the server staff about an issue, please create a ticket using <@${config.ModMailId}>:\n**1.** DM modmail \`\`=new\`\` followed by the message you wish to send.\n**2.** If you are in multiple servers that use Modmail, select the "Temple University" server to receive your message.\n**3.** Wait for a response back from the moderation team.`)
            .setFooter(`Note: ModMail is intended for moderation-related issues and questions. Sending invalid issues, spam, or any other abuse of ModMail may result in being blocked from submitting future ModMail tickets and potential other moderation actions.`)


        // IF MESSAGE ID DNE IN DATABASE, POST THEN LOG MSG INFO IN DB
        if(!dbData.RULES_MSG_ID) {
            // POSTING EMBEDS
            await message.channel.send({embeds: [rules, serverStaffList, ModmailHelp ] })
                .catch(err => console.log(err))

                // GETTING MESSAGE ID OF ticketEmbed
                .then(sentEmbed => {
                    rulesEmbedMsgId = sentEmbed.id;
                })

            // STORING IN DATABASE THE RULE EMBED'S MESSAGE ID AND CHANNEL ID
            await guildSchema.findOneAndUpdate({
                // CONTENT USED TO FIND UNIQUE ENTRY
                GUILD_NAME: message.guild.name,
                GUILD_ID: message.guild.id
            },{
                // CONTENT TO BE UPDATED
                RULES_CH_ID: message.channel.id,
                RULES_MSG_ID: rulesEmbedMsgId
            },{ 
                upsert: true
            })

            // DEFINING LOG EMBED
            let logRulesIDEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`${config.emjGREENTICK} New Rules posted - details saved to database for updating.`)
            .addField(`RULES_MSG_ID`, `${dbData.RULES_MSG_ID}`)
            .addField(`RULES_CH_ID`, `${dbData.RULES_CH_ID}`)

            // LOG ENTRY
            client.channels.cache.get(config.logActionsChannelId).send({embeds: [logRulesIDEmbed]})
                .catch(err => console.log(err))

            return;
        }

        // IF MESSAGE ID EXISTS IN DATABASE, EDIT THE EMBED WITHOUT TOUCHING MESSAGE ID IN DATABASE
        if(dbData.RULES_MSG_ID) {

            // GETTING THE VERIFICATION PROMPT CHANNEL ID FROM DATABASE
            rulesEmbedId = dbData.RULES_MSG_ID

            // SENDING TO CHANNEL
            rulesEmbedId.edit({embeds: [rules, serverStaffList, ModmailHelp ] })

            // DEFINING LOG EMBED
            let logRulesIDEmbed = new discord.MessageEmbed()
            .setColor(config.embedGreen)
            .setTitle(`${config.emjGREENTICK} Rules embed updated.`)

            // LOG ENTRY
            client.channels.cache.get(config.logActionsChannelId).send({embeds: [logRulesIDEmbed]})
                .catch(err => console.log(err))

            return;
        }
    }
}