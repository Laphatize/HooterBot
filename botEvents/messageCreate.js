const discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const config = require('../config.json');
const ticketSchema = require('../Database/ticketSchema');
const levels = require('discord-xp');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
                            
        /***********************************************************/
        /*      VERIFICATION TICKETS                               */
        /***********************************************************/

        // TICKET CHANNEL NAME
        let ticketChannelName = `verify-${message.author.username.toLowerCase()}`;
        

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


            // CHECK IF THERE EXISTS A TICKET CHANNEL FOR THE USER
            ticketChannel = message.guild.channels.cache.find(ch => ch.name === ticketChannelName)


            // IF TICKET CHANNEL EXISTS, PASS ON MESSAGE TO SERVER
            if (ticketChannel) {

                // GRABBING TICKET CHANNEL FOR THE USER USING THE GUILD ID IN THE DATABASE
                const dbTicketData = await ticketSchema.findOne({
                    CREATOR_ID: message.author.id
                }).exec();


                // FETCHING THE GUILD FROM DATABASE
                guild = client.guilds.cache.get(dbTicketData.GUILD_ID)


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
            dmUsername = message.channel.name.split('-').pop()
                        
            
            // GRAB USER ID FROM DATABASE USING THE CHANNEL NAME
            const dbTicketData = await ticketSchema.findOne({
                CREATOR_NAME: dmUsername
            }).exec();


            // FETCHING THE GUILD FROM DATABASE
            guild = client.guilds.cache.get(dbTicketData.GUILD_ID)

            
            // FETCH THE USER USING THEIR ID FROM THE DATABASE USING THE CHANNEL NAME
            const dmUser = await guild.members.fetch(dbTicketData.CREATOR_ID)

            
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
            || message.channel.name.startsWith(`'verify-`)
            || message.channel.name.startsWith(`'closed-`)
            || message.channel.name.startsWith(`'archived-`)
            || message.author.bot
        ) {
            return;
        }

        
        // RANDOM XP TO ADD: [15, 25]
        xpToAdd = Math.floor(Math.random()*11) + 15;

        const hasLeveledUp = await levels.appendXp(message.author.id, message.guild.id, xpToAdd)
            .catch(err => console.log(err))

        if(hasLeveledUp) {
            const user = await levels.fetch(message.author.id, message.guild.id);

            // BOT-CHANNEL MESSAGE
            message.guild.channels.cache.find(ch => ch.name === `🤖｜bot-spam`).send({ content: `${createLevelMsg(message.author.username, user.level)}` })
                .catch(err => console.log(err))
        }


        /***********************************************************/
        /*      SLASH COMMANDS                                     */
        /***********************************************************/
        if (message.content.toLowerCase() === '!deploy' && message.author.id === config.botAuthorId) {

            // SLASH COMMANDS PERMISSIONS LIST
            // IF COMMAND NOT LISTED, ENABLED FOR ALL USERS
            // TEST SERVER

            const testServerModRoleId = 863645415458865163;
            const testServerAdminRoleId = 863650974513758259;
            const secondTestServerModRoleId = 870168204444590141;
            const secondTestServerAdminRoleId = 870168169162108968;
            const templeServerModRoleId = 835182957160300604;
            const templeServerAdminRoleId = 829416550867140608;

            const fullPermissions = [
                // ADMINISTRATOR OVERRIDES
                {
                    // PARTNER MESSAGE - ADMIN ROLE OVERRIDES
                    id: '871240034152501259',
                    permissions: [{
                        id: testServerAdminRoleId,
                        type: 'ROLE',
                        permission: true,
                    }],
                },{
                    // RULES - ADMIN ROLE OVERRIDES
                    id: '871240034152501260',
                    permissions: [{
                        id: testServerAdminRoleId,
                        type: 'ROLE',
                        permission: true,
                    }],
                },{
                    // USER_BIRTHDAY - ADMIN ROLE OVERRIDES
                    id: '871240034152501261',
                    permissions: [{
                        id: testServerAdminRoleId,
                        type: 'ROLE',
                        permission: true,
                    }],
                },{
                    // USER_LEVELIMPORT - ADMIN ROLE OVERRIDES
                    id: '871663009343369237',
                    permissions: [{
                        id: testServerAdminRoleId,
                        type: 'ROLE',
                        permission: true,
                    }],
                },{
                    // VERIFICATION_BLACKLIST - ADMIN ROLE OVERRIDES
                    id: '871502773286490194',
                    permissions: [{
                        id: testServerAdminRoleId,
                        type: 'ROLE',
                        permission: true,
                    }],
                },{
                    // VERIFICATION_CATEGORY - ADMIN ROLE OVERRIDES
                    id: '871502773286490195',
                    permissions: [{
                        id: testServerAdminRoleId,
                        type: 'ROLE',
                        permission: true,
                    }],
                },{
                    // VERIFICATION_MAINTENANCE - ADMIN ROLE OVERRIDES
                    id: '871502773286490196',
                    permissions: [{
                        id: testServerAdminRoleId,
                        type: 'ROLE',
                        permission: true,
                    }],
                },{
                    // VERIFICATION_PERKSEMBED - ADMIN ROLE OVERRIDES
                    id: '871502773286490197',
                    permissions: [{
                        id: testServerAdminRoleId,
                        type: 'ROLE',
                        permission: true,
                    }],
                },{
                    // VERIFICATION_PROMPTEMBED - ADMIN ROLE OVERRIDES
                    id: '871502773286490198',
                    permissions: [{
                        id: testServerAdminRoleId,
                        type: 'ROLE',
                        permission: true,
                    }],
                },{
                    // PERMISSIONS - ADMIN ROLE OVERRIDES
                    id: '872636336719429652',
                    permissions: [{
                        id: testServerAdminRoleId,
                        type: 'ROLE',
                        permission: true,
                    },{
                    // PERMISSIONS - MOD ROLE OVERRIDES
                        id: testServerModRoleId,
                        type: 'ROLE',
                        permission: true,
                    }],
                },{
                    // USER_INFO - ADMIN ROLE OVERRIDES
                    id: '871449279145848872',
                    permissions: [{
                        id: testServerAdminRoleId,
                        type: 'ROLE',
                        permission: true,
                    },{
                    // USER_INFO - MOD ROLE OVERRIDES
                        id: testServerModRoleId,
                        type: 'ROLE',
                        permission: true,
                    }],
                },{
                    // VERIF_PM - ADMIN ROLE OVERRIDES
                    id: '872184009780781128',
                    permissions: [{
                        id: testServerAdminRoleId,
                        type: 'ROLE',
                        permission: true,
                    },{
                    // VERIF_PM - MOD ROLE OVERRIDES
                        id: testServerModRoleId,
                        type: 'ROLE',
                        permission: true,
                    }],
                },
            ];


            // TEST SERVER
            await client.guilds.cache.get('530503548937699340')?.commands.permissions.set({ fullPermissions })

            // 2ND TEST SERVER
            await client.guilds.cache.get('859798908841230367')?.commands.permissions.set({ fullPermissions })

            // TEMPLE SERVER
            // await client.guilds.cache.get('859798908841230367')?.commands.permissions.set({ slashCmdsPermArray })
        }
    }
}


// FUNCTION THAT GENERATES THE RANDOM LEVEL UP MESSAGE
function createLevelMsg(username, level) {
    const channelMsgStart = [
        `${config.emjOwl} GG **${username}**, you've reached: \`\` Level ${level} \`\``,
        `**${username}**'s reached \`\` Level ${level} \`\` ${config.emjOwl}`,
        `Congrats on leveling up, **${username}**! ${config.emjOwl} You've reached \`\` Level ${level} \`\``,
        `**${username}**, you've talked so much,you're leveling up! \`\` Level ${level} \`\` ${config.emjOwl}`
    ];      
    return channelMsgStart[Math.floor(Math.random() * channelMsgStart.length)];
}