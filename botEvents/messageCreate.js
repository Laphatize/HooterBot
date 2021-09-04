const discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const config = require('../config.json');
const ticketSchema = require('../Database/ticketSchema');
const modAppTicketSchema = require('../Database/modappSchema');
const levels = require('discord-xp');
const wait = require('util').promisify(setTimeout);

// COOLDOWN FOR XP SYSTEM
const cooldowns = new Set()


module.exports = {
	name: 'messageCreate',
	async execute(message, client) {



        /***********************************************************/
        /*      MOD APPLICATION TICKETS                            */
        /***********************************************************/
        
        // MESSAGES IN THE USER'S MOD APP CHANNEL
        if(message.channel.name == `modapp-${message.author.id}`) {
            // IGNORE HOOTERBOT'S OWN MESSAGES
            if(message.author.bot)   return;


            // CHECK IF DATABASE HAS AN ENTRY FOR THE GUILD
            const dbData = await modAppTicketSchema.findOne({
                USER_ID: message.author.id
            }).exec();


            // WAIT 3.5 SECONDS TO FOLLOW UP WITH NEXT RESPONSE
            await wait(3500)


            // SENDING QUESTION 2
            if(dbData.Q2 == false) {
                
                let modAppQuestionTwo = new discord.MessageEmbed()
                    .setColor(config.embedBlurple)
                    .setTitle(`Question 2:`)
                    .setDescription(`**Do you have any moderation experience on Discord or elsewhere?**\nPlease describe, otherwise, type \`\`None\`\`.`)

                message.channel.send({ embeds: [modAppQuestionTwo] })

                // UPDATE DATABASE
                await modAppTicketSchema.findOneAndUpdate({
                    USERNAME: message.author.username.toLowerCase(),
                    USER_ID: message.author.id
                },{
                    // CONTENT TO BE UPDATED
                    Q2: true,
                },{ 
                    upsert: true
                }).exec();
            }


            // SENDING QUESTION 3
            if(dbData.Q2 == true
               && dbData.Q3 == false ) {

                    let modAppQuestionThree = new discord.MessageEmbed()
                        .setColor(config.embedBlurple)
                        .setTitle(`Question 3:`)
                        .setDescription(`**How often are you on Discord and the Temple server per day? Per week?**\n(We expect moderators to be active in the server regularly as a core part of the position.)`)

                    message.channel.send({ embeds: [modAppQuestionThree] })

                    // UPDATE DATABASE
                    await modAppTicketSchema.findOneAndUpdate({
                        USERNAME: message.author.username.toLowerCase(),
                        USER_ID: message.author.id
                    },{
                        // CONTENT TO BE UPDATED
                        Q3: true,
                    },{ 
                        upsert: true
                    }).exec();
            }


            // SENDING QUESTION 4
            if(dbData.Q2 == true
               && dbData.Q3 == true
               && dbData.Q4 == false ) {

                    let modAppQuestionFour = new discord.MessageEmbed()
                        .setColor(config.embedBlurple)
                        .setTitle(`Question 4:`)
                        .setDescription(`**[TBD]**`)

                    message.channel.send({ embeds: [modAppQuestionFour] })

                    // UPDATE DATABASE
                    await modAppTicketSchema.findOneAndUpdate({
                        USERNAME: message.author.username.toLowerCase(),
                        USER_ID: message.author.id
                    },{
                        // CONTENT TO BE UPDATED
                        Q4: true,
                    },{ 
                        upsert: true
                    }).exec();
            }

            // SENDING QUESTION 5
            if(dbData.Q2 == true
                && dbData.Q3 == true
                && dbData.Q4 == true 
                && dbData.Q5 == false ) {
                    
                    let modAppQuestionFive = new discord.MessageEmbed()
                        .setColor(config.embedBlurple)
                        .setTitle(`Question 5:`)
                        .setDescription(`**Suppose a few users in #general are in a heated argument. What would you do?**`)
    
                    message.channel.send({ embeds: [modAppQuestionFive] })
    
                    // UPDATE DATABASE
                    await modAppTicketSchema.findOneAndUpdate({
                        USERNAME: message.author.username.toLowerCase(),
                        USER_ID: message.author.id
                    },{
                        // CONTENT TO BE UPDATED
                        Q5: true,
                    },{ 
                        upsert: true
                    }).exec();
                }

            // SENDING TICKET CLOSE
            if(dbData.Q2 == true
                && dbData.Q3 == true
                && dbData.Q4 == true 
                && dbData.Q5 == true ) {
                    // USER SENT THEIR FIRST MESSAGE, SEND SECOND QUESTION
    
                    let modAppQuestionFive = new discord.MessageEmbed()
                        .setColor(config.embedBlurple)
                        .setTitle(`Application Complete:`)
                        .setDescription(`Thank you for applying. If you have any questions for the admins about becoming a moderator, please leave your questions below.\nOnce the application window closes, the admins will review all applications and announce the new moderator(s).`)
    
                    message.channel.send({ embeds: [modAppQuestionFive] })
                    .then(msg => {
                        // RENAME CHANNEL TO AVOID DB CALL ISSUES
                        msg.channel.setName(`modapp-${message.author.username.toLowerCase()}-completed`)
                    })
    
                    // UPDATE DATABASE
                    await modAppTicketSchema.findOneAndDelete({
                        USERNAME: message.author.username.toLowerCase(),
                        USER_ID: message.author.id
                    }).exec();
                }
        }



                            
        /***********************************************************/
        /*      VERIFICATION TICKETS                               */
        /***********************************************************/

        // TICKET CHANNEL NAME
        let ticketChannelName = `verify-${message.author.id}`;
        

        // PARTIAL MESSAGE
        if (message.partial) {
            try {
                await message.fetch()
            } catch (err) {
                return console.log(err);
            }
        }

        // PARTIAL CHANNEL
        if (message.channel.partial) {
            try {
                await message.channel.fetch()
            } catch (err) {
                return console.log(err);
            }
        }
        

        // IN DMS, CHECK IF USER HAS A TICKET OPEN BY MATCHING THEIR USERNAME TO CHANNEL
        if (message.channel.type === 'DM') {

            // IGNORE HOOTERBOT'S OWN MESSAGES
            if(message.author.bot)   return;


            // GRABBING TICKET CHANNEL FOR THE USER USING THE GUILD ID IN THE DATABASE
            const dbTicketData = await ticketSchema.findOne({
                CREATOR_ID: message.author.id
            }).exec();


            // IF NO TICKET OPEN, IGNORE ALL DM MESSAGES - BOT CRASH OTHERWISE
            if(!dbTicketData) {
                // EMBED NOTICE
                let dmMsgEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setDescription(`Sorry, I couldn't find a verification ticket open for you and I am unable to run commands in DMs.`)
                return message.reply({ embeds: [dmMsgEmbed] })
            }


            // FETCHING THE GUILD FROM DATABASE 
            guild = client.guilds.cache.get(dbTicketData.GUILD_ID)

            // GRAB USER'S TICKET CHANNEL
            ticketChannel = guild.channels.cache.find(ch => ch.name === ticketChannelName)


            // IF TICKET CHANNEL EXISTS, PASS ON MESSAGE TO SERVER
            if (ticketChannel) {

                // GRABBING TICKET CHANNEL FOR THE USER USING THE GUILD ID IN THE DATABASE
                const dbTicketData = await ticketSchema.findOne({
                    CREATOR_ID: message.author.id
                }).exec();


                // GRABBING TICKET CHANNEL IN GUILD
                modAdminTicketCh = guild.channels.cache.find(ch => ch.name === ticketChannelName)



            // USER'S DMs -> MOD/ADMIN TICKET CHANNEL
                // NO ATTACHMENT
                if(message.attachments.size == 0) {

                    // GRABBING MESSAGE CONTENT AND FORMATTING FOR EMBED
                    let userTicketMsg = new discord.MessageEmbed()
                        .setColor(config.embedGrey)
                        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic:true }))
                        .setDescription(message.content)
                        .setTimestamp()
                        
                    await modAdminTicketCh.send({ embeds: [userTicketMsg] })
                        .catch(err => {
                            console.log(err)
                            message.react(client.emojis.cache.get('719009809856462888'))
                            message.channel.send(`${config.emjREDTICK} Sorry, there was an error sending this message.`)
                        })
                    // ADD SUCCESS EMOJI TO THE ORIGINAL DM MESSAGE ONCE SENT
                    return message.react(client.emojis.cache.get('868910701295587368'))
                }


                // WITH AN ATTACHMENT
                if(message.attachments.size !== 0) {

                    // GRAB ATTACHMENT
                    dmMsgAttachment = await message.attachments.first().url

                    // GRABBING MESSAGE CONTENT AND FORMATTING FOR EMBED
                    let userTicketMsgImage = new discord.MessageEmbed()
                        .setColor(config.embedGrey)
                        .setTitle(`${message.author.username.toUpperCase()}'S VERIFICATION PROOF`)
                        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic:true }))
                        .setDescription(message.content)
                        .setImage(dmMsgAttachment)
                        .setTimestamp()
                        .setFooter(`If the image is too small, click to open a larger view.`)


                    // BUTTONS FOR APPROVE/DENY VERIFICATION PROOF
                    let ApproveProofButton = new MessageButton()
                        .setLabel("Approve")
                        .setStyle("SUCCESS")
                        .setCustomId("Proof_Approved")
                    let RejectProofButton = new MessageButton()
                        .setLabel("Reject")
                        .setStyle("DANGER")
                        .setCustomId("Proof_Rejected")


                    // BUTTON ROW
                    let VerifProofButtonRow = new MessageActionRow()
                        .addComponents(
                            ApproveProofButton,
                            RejectProofButton
                        );



                    // SEND EMBED
                    await modAdminTicketCh.send({ embeds: [userTicketMsgImage], components: [VerifProofButtonRow] })
                        .catch(err => {
                            console.log(err)
                            message.react(client.emojis.cache.get('719009809856462888'))
                            message.channel.send(`${config.emjREDTICK} Sorry, there was an error sending this message.`)
                        })

                    // PROOF CONFIRMED MESSAGE
                    let proofAcknowledgement = new discord.MessageEmbed()
                        .setColor(config.embedGrey)
                        .setTitle(`Verification Proof Received`)
                        .setDescription(`The Temple University server staff has received your verification proof. If accepted, this ticket will be closed and you'll be given the <:verified:856359139205447711> Verified role. If not accepted, you will receive more information.`)
                        .setTimestamp()
                    
                    // ADD SUCCESS EMOJI TO THE ORIGINAL DM MESSAGE ONCE SENT
                    message.react(client.emojis.cache.get('868910701295587368'))

                    // SEND CONFIRMATION MESSAGE
                    message.channel.send({ embeds: [proofAcknowledgement] })

                }
            }
        }



        // IF MESSAGE IS SENT IN A GUILD TICKET CHANNEL
        if (message.channel.type == 'GUILD_TEXT' && message.channel.name.startsWith(`verify-`)) {

            // IGNORE HOOTERBOT'S OWN MESSAGES
            if(message.author.bot)   return;
            

            // GRAB THE USERNAME FROM THE CHANNEL THE MESSAGE WAS SENT IN
            dmUserId = message.channel.name.split('-').pop()
                        
            
            // GRAB USER ID FROM DATABASE USING THE CHANNEL NAME
            const dbTicketData = await ticketSchema.findOne({
                CREATOR_ID: dmUserId
            }).exec();


            // FETCHING THE GUILD FROM DATABASE
            guild = client.guilds.cache.get(dbTicketData.GUILD_ID)

            
            // FETCH THE USER USING THEIR ID FROM THE DATABASE USING THE CHANNEL NAME
            const dmUser = await guild.members.fetch(dmUserId)

            
        // MOD/ADMIN TICKET CHANNEL -> USER'S DMs
            // NO ATTACHMENT
            if(message.attachments.size == 0) {

                // GRABBING MESSAGE CONTENT AND FORMATTING FOR EMBED
                let userTicketMsg = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic:true }))
                    .setDescription(message.content)
                    .setTimestamp()

                await dmUser.send({ embeds: [userTicketMsg] })
                    .catch(err => {
                        message.react(client.emojis.cache.get('719009809856462888'))
                        message.channel.send(`${config.emjREDTICK} There was an error sending this message.`)
                    })
                // ADD SUCCESS EMOJI TO THE ORIGINAL CHANNEL MESSAGE ONCE SENT
                return message.react(client.emojis.cache.get('868910701295587368'))
            }

            // WITH AN ATTACHMENT
            if(message.attachments.size !== 0) {

                // GRAB ATTACHMENT
                chMsgAttachment = await message.attachments.first().url

                // GRABBING MESSAGE CONTENT AND FORMATTING FOR EMBED
                let userTicketMsg = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic:true }))
                    .setDescription(message.content)
                    .setImage(chMsgAttachment)
                    .setTimestamp()

                // SEND EMBED
                await dmUser.send({ embeds: [userTicketMsg] })
                    .catch(err => {
                        message.react(client.emojis.cache.get('719009809856462888'))
                        message.channel.send(`${config.emjREDTICK} There was an error sending this message.`)
                    })

                // ADD SUCCESS EMOJI TO THE ORIGINAL CHANNEL MESSAGE ONCE SENT
                return message.react(client.emojis.cache.get('868910701295587368'))
            }
        }

                
        
        /***********************************************************/
        /*      LEVELS                                             */
        /***********************************************************/
        
        // NO LEVELING FROM MESSAGES IN BOT SPAM OR SHITPOSTING
        if (message.channel.type === "DM"
            || message.channel.name === '🤖｜bot-spam' 
            || message.channel.name === `💩｜shitposting`
            || message.channel.name === `🎵｜music-commands`
            || message.channel.name === `🔇｜no-mic`
            || message.channel.name.startsWith(`'verify-`)
            || message.channel.name.startsWith(`'closed-`)
            || message.channel.name.startsWith(`'archived-`)
            || message.author.bot
        ) {
            return;
        }

        // IF WITHIN COOLDOWN, NO XP
        if(cooldowns.has(message.author.id)) return;


        // NO CURRENT COOLDOWN, SET
        cooldowns.add(message.author.id)

        // [15, 25]XP PER MESSAGE
        xpToAdd = Math.floor(Math.random()*11) + 15;

        // COOLDOWN EXPIRES AFTER 60s
        setTimeout(() => cooldowns.delete(message.author.id), 60000)



        // USER HAS LEVELED UP
        const hasLeveledUp = await levels.appendXp(message.author.id, message.guild.id, xpToAdd)
            .catch(err => console.log(err))


        // SEND MESSAGE IN BOT-CHANNEL
        if(hasLeveledUp) {
            const user = await levels.fetch(message.author.id, message.guild.id);
            message.guild.channels.cache.find(ch => ch.name === `🤖｜bot-spam`).send({ content: `${createLevelMsg(message.author.username, user.level)}` })
                .catch(err => console.log(err))
        }


        /***********************************************************/
        /*      SLASH COMMANDS                                     */
        /***********************************************************/
        // if (!client.application?.owner) await client.application?.fetch();

        // // TO GET UPDATED LIST OF SLASH COMMAND DATA, INCLUDING SLASH COMMAND ID'S, RUN:
        // if(message.content == 'hooterbot$slashcommanddata' && message.author.id === client.application?.owner.id) {
        //     console.log(`****************************************\nHOOTERBOT'S SLASH COMMANDS\n****************************************`)
        //     console.log(await message.guild?.commands.fetch())
        //     console.log(`****************************************\nEND OF SLASH COMMAND DATA\n****************************************`)
        // }




        /****************************************************************/
        /*      LINK READER - ONLY WORKING FOR CACHED MESSAGES <4 HRS   */
        /****************************************************************/
        // DISCORD MESSAGE LINK FORMAT - FROM THE SAME SERVER
        let discordMsgLinkFormat = `https://discord.com/channels/${message.guild.id}/`


        // MESSAGE CONTAINS A LINK TO ANOTHER MESSAGE
        if(message.content.includes(discordMsgLinkFormat)) {
            // FINDING URL IN MESSAGE, CUTTING DOWN INTO USEFUL PIECES
            let msgLink = message.content.slice(message.content.indexOf(discordMsgLinkFormat)).split(' ')
            let msgFullUrl = msgLink[0]
            let splitArgs = msgFullUrl.split('/')

            // GRABBING MESSAGE CHANNEL ID AND MESSAGE ID FROM URL
            let messageChannelId = splitArgs[5];
            let messageId = splitArgs[6].split(' ');
            
            

            // CHANNEL
            let msgCh = message.guild.channels.cache.get(messageChannelId)

            // MESSAGE
            await msgCh.messages.fetch({}, false, true)
                .then(async msg => {
                    
                    // [ MESSAGE ID , {MSG_OBJ} ]
                    let grabbedMessage = msg.get(`${messageId}`)


                    let msgLinkQuoteEmbed
                    try {
                        msgLinkQuoteEmbed = new discord.MessageEmbed()
                            .setColor(config.embedDarkGrey)
                            .setAuthor(grabbedMessage.author.tag, grabbedMessage.author.displayAvatarURL({ dynamic:true }))
                            .setDescription(`${grabbedMessage.content}\n\n[Jump to message](${msgFullUrl})`)
                            .setTimestamp(grabbedMessage.createdTimestamp)
                    } catch {
                        msgLinkQuoteEmbed = new discord.MessageEmbed()
                            .setColor(config.embedDarkGrey)
                            .setAuthor(`Unknown Author`)
                            .setDescription(`${grabbedMessage.content}\n\n[Jump to message](${msgFullUrl})`)
                            .setTimestamp(grabbedMessage.createdTimestamp)
                    }

                    // SENDING BACK IN CHANNEL
                    return message.channel.send({ embeds: [msgLinkQuoteEmbed] })
                })
        }



        if(message.content.toLowerCase().startsWith(`$ticketoverflow`) && message.author.id == config.botAuthorId) {
            
            setTimeout(() => message.delete(), 0)

            ticketMaxNoticeEmbed = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic:true }))
                .setDescription(`Due to the large influx of new members we've recevied the past few days and Discord API limits, I need to **temporarily pause new verification submissions** until the number of open tickets decreases. If you are looking to verify, consider **enabling notifications** for all messages posted in this channel as I will post a follow-up message when verification reopens (hopefully in a day or two at most).\n\nThanks for your understanding! :)`)

            return message.channel.send({ embeds: [ticketMaxNoticeEmbed] })
        }
    }
}


// FUNCTION THAT GENERATES THE RANDOM LEVEL UP MESSAGE
function createLevelMsg(username, level) {
    const channelMsgStart = [
        `${config.emjOwl} GG **${username}**, you've reached: \`\` Level ${level} \`\``,
        `**${username}**'s reached \`\` Level ${level} \`\` ${config.emjOwl}`,
        `Congrats on leveling up, **${username}**! ${config.emjOwl} You've reached \`\` Level ${level} \`\``,
        `**${username}**, you've talked so much, you're leveling up! \`\` Level ${level} \`\` ${config.emjOwl}`
    ];      
    return channelMsgStart[Math.floor(Math.random() * channelMsgStart.length)];
}