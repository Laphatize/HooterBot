const discord = require('discord.js')
const config = require ('../../config.json')
const guildSchema = require('../../Database/guildSchema');


module.exports = {
    name: 'rules_embed',
    description: 'ADMIN | Generates/updates rules, server staff, and ModMail ticket instruction embeds. [60s]',
    options: [],
    permissions: 'ADMINISTRATOR',
    dmUse: false,
    cooldown: 60,
    defaultPermission: false,
    run: async(client, interaction, inputs) => {
        
        // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
        const dbData = await guildSchema.findOne({
            GUILD_ID: interaction.guild.id
        }).exec();


        // MAIN RULES EMBED
        let rulesListStart = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle('**Rules**')
            .setDescription(`By participating in this server, you agree to comply with these rules regardless if you have read them in their entirety.
            \n**1. Communicate in English**\n > All communication within the server needs to be in English. 
            \n**2. Be respectful of all members**\n > We have zero tolerance for discriminatory rhetoric, racism, sexism, homophobia, transphobia, or any other kind of offensive language. The use of inappropriate language and profanity should be kept to a minimum. Derogatory language and slurs are prohibited. This includes usernames, nicknames, and statuses
            \n**3. No spam, mention spamming, or ghost pinging**\n > This includes excessive use of text, emojis, GIFs, and reactions. Ghost pinging is tagging a user then deleting the message for the sake of pinging and frustrating users.
            \n**4. Keep channels on-topic**\n > If discussion is not relevant to the channel, consider taking it to <#829409161581821997> or <#829409161581822000>. If discussion digresses from the channel topic, consider opening a thread to continue your conversation. All memes must go in <#829409161581821999>. Mods reserve the right to delete messages that do not fit the channel subject.
            \n**5. No NSFW material or discussions that may cause hostility**\n > Explicit content/porn is not allowed ANYWHERE in the server. Discussions about politics, religion, or anything that may cause hostility are prohibited.
            `)


        let rulesListEnd = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setDescription(`**6. No advertising**\n > This includes ads for other communities, streams, or goods. Verified users may post student opportunities in <#829732282079903775>, though these are still subject to moderator discretion. DM advertising is strictly prohibited and will result in an immediate ban.
            \n**7. No server raiding**\n > Discussion of raids or participating in raids is not allowed.
            \n**8. Abide by Discord's Community Guidelines and Terms of Service (ToS) as well as Temple University's Student Code of Conduct**\n > ??? [Community Guidelines](https://discord.com/guidelines)\n > ??? [Terms of Service](https://discord.com/terms)\n > ??? [Student Conduct Code](https://secretary.temple.edu/sites/secretary/files/policies/03.70.12.pdf)
            \n**9. Moderator and Admin decisions are final**\n > Decisions are made at the moderation team's discretion based on evidence and context of a situation.
            \n**10. Multiple warnings will result in mutes and eventual bans**\n > The admins and moderators reserve discretion in expediting this process based on the severity of a situation.
            `)


        // SERVER STAFF EMBED
        let serverStaffList = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`**Server Staff**`)
            .addField(`${config.emjAdmin} Admins:`, `<@400071708947513355>, <@694391619868295241>, <@472185023622152203>`)
            .addField(`${config.emjModerator} Moderators:`, `<@626143139639459841>, <@395791768328601610>, <@132866617745866753>, <@418870468955602944>`)

        // MODMAIL INSTRUCTIONS EMBED
        let ModmailHelp = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`**Need help?**`)
            .setDescription(`If you need to speak with a member of the server staff about an issue, please create a ticket using <@${config.ModMailId}>:\n**1.** DM modmail \`\`=new\`\` followed by the message you wish to send as a single message (e.g. \`\`=new I received (...)\`\`).\n**2.** If you are in multiple servers that use Modmail, select the "Temple University" server to receive your message.\n**3.** Wait for a response back from the moderation team.`)
            .setFooter(`Note: ModMail is intended for moderation-related issues and questions. Sending invalid issues, spam, or any other abuse of ModMail may result in being blocked from submitting future ModMail tickets and possibly other moderation actions.`)


        // FETCH RULES CHANNEL
        let rulesChannel = interaction.guild.channels.cache.find(ch => ch.name === `rules`)


        // IF MESSAGE ID DNE IN DATABASE, POST THEN LOG MSG INFO IN DB
        if(!dbData.RULES_MSG_ID) {
            
            // POSTING EMBEDS
            await rulesChannel.send({ embeds: [rulesListStart, rulesListEnd, serverStaffList, ModmailHelp] })
                .catch(err => console.log(err))

                // GETTING MESSAGE ID OF ticketEmbed
                .then(sentEmbed => {
                    rulesEmbedMsgId = sentEmbed.id;
                })


            // STORING IN DATABASE THE RULE EMBED'S MESSAGE ID AND CHANNEL ID
            await guildSchema.findOneAndUpdate({
                // CONTENT USED TO FIND UNIQUE ENTRY
                GUILD_NAME: interaction.guild.name,
                GUILD_ID: interaction.guild.id
            },{
                // CONTENT TO BE UPDATED
                RULES_MSG_ID: rulesEmbedMsgId
            },{ 
                upsert: true
            }).exec();


            // REPLYING TO INTERACTION
            let postSuccessfulEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} New Rules posted successfully.`)
                .setTimestamp()

            interaction.reply({ embeds: [postSuccessfulEmbed], ephemeral: true })


            // DEFINING LOG EMBED
            let logRulesIDEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} New Rules posted - details saved to database for updating.`)
                .setTimestamp()


            // LOG ENTRY
            return interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logRulesIDEmbed] })
                .catch(err => console.log(err))
        }


        // IF MESSAGE ID EXISTS IN DATABASE, EDIT THE EMBED WITHOUT TOUCHING MESSAGE ID IN DATABASE
        if(dbData.RULES_MSG_ID) {

            // GETTING THE VERIFICATION PROMPT CHANNEL ID FROM DATABASE
            await rulesChannel.messages.fetch(dbData.RULES_MSG_ID)
                .then(msg => {
                    msg.edit({ embeds: [rulesListStart, rulesListEnd, serverStaffList, ModmailHelp] })
                })
                .catch(err => console.log(err))


            // REPLYING TO INTERACTION
            let updateSuccessfulEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} Rules post successfully updated.`)
                .setTimestamp()

            interaction.reply({ embeds: [updateSuccessfulEmbed], ephemeral: true })


            // DEFINING LOG EMBED
            let logRulesIDEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} Rules embed updated.`)
                .setTimestamp()


            // LOG ENTRY
            return interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logRulesIDEmbed] })
                .catch(err => console.log(err))
        }
    }
}