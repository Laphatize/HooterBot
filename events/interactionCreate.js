// const discord = require('discord.js')
// const config = require ('../config.json');
// const guildSchema = require('../Database/guildSchema');
// const ticketSchema = require('../Database/ticketSchema');

// module.exports = {
// 	name: 'clickButton',
// 	async execute(button, client) {
	
//         // VERIFICATION PROMPT FOR #ROLES
//         // VERIFY PROMPT BUTTON TO BEGIN VERIFICATION
//         if(button.id ==="begin_verification_button") {
//             button.defer()
            
//             // GETTING PERSON WHO CLICKED BUTTON (OBJECT)
//             let user = await button.clicker.user.fetch();   // user = @MrMusicMan789 (OBJECT)
//             let clickUserTag = user.tag;                    // clickUserTag = MrMusicMan789#0789
//             let clickUsername = user.username;              // clickUsername = MrMusicMan789
//             let clickUserId = user.id;                      // clickUserID = 472185023622152203


//             // DATABASE RETRIEVING TICKET CATEGORY FOR CHANNEL CREATION
//             try {
//                 console.log(`Retrieving TICKET_CAT_ID via findOne for the guild: ${button.guild.name}`)

//                 const result = await guildSchema.findOne(
//                     {
//                         GUILD_ID: button.guild.id
//                     },{
//                         // CONTENT TO BE PULLED
//                         TICKET_CAT_ID:1
//                     })

//                 // SETTING TICKET CATEGORY ID FROM DATABASE SO IT CAN BE USED
//                 ticketCategory = result.TICKET_CAT_ID;
//             } finally {
//                 console.log(`TICKET_CAT_ID obtained for the guild: ${button.guild.name}`)
//             }



//             // // CREATE TICKET CHANNEL FOR USER, GIVE THE USER AND ADMINS+MODS ACCESS
//             //     // THE CHANNEL NAME IS THE USERTAG (e.g. "MrMusicMan789#0789")
//             // message.guild.channels.create(`${clickUserTag}`, {
//             //     type: 'text',
//             // })

//             // LOGGING THE NEW TICKET CHANNEL ID TO DATABASE


//             // LOGGING TICKET CREATION
//             let logVerifStartEmbed = new discord.MessageEmbed()
//             .setColor(config.embedDarkGrey)
//             .setTitle(`Verification Started`)
//             .addField(`User:`, `${user}`, true)
//             .addField(`User ID:`, `${clickUserId}`, true)
//             .addField(`Ticket Channel:`, `*(link to the channel, once that code is set up...)*`)
//             .setTimestamp()

//             // SENDING TO LOG CHANNEL
//             client.channels.cache.get(config.logActionsChannelId).send({embeds: [logVerifStartEmbed] })

            

//             // GENERATING EMBED AND BUTTONS FOR USER
//             let ticketEmbed = new discord.MessageEmbed()
//                 .setColor(config.embedTempleRed)
//                 .setTitle(`**Verification - Ticket Opened**`)
//                 .setDescription(`Thanks for wanting to verify in the <:TempleT:857293539779018773> Temple University server.\nThere are **3** ways to verify:\n- Use a **physical TUid card**\n- Use a **virtual TUid card**\n- Using **TUportal**\n\nSelect the method you want to use below.`)
//                 .setFooter("This panel is undergoing testing. If the buttons do not work, please let MMM know.")

//             // INITIALIZING BUTTON
//             let TUidCardButton = new disbut.MessageButton()
//                 .setLabel("Physical TUid Card")
//                 .setStyle("grey")
//                 .setID("physical_TUid_Card")
//             let VirtualTUidCardButton = new disbut.MessageButton()
//                 .setLabel("Virtual TUid Card")
//                 .setStyle("grey")
//                 .setID("virtual_TUid_Card")
//             let TuPortalButton = new disbut.MessageButton()
//                 .setLabel("TUportal")
//                 .setStyle("grey")
//                 .setID("TU_portal")
//             let CancelButton = new disbut.MessageButton()
//                 .setLabel("Quit Verification")
//                 .setStyle("red")
//                 .setID("quit")

//             let initialButtonRow = new disbut.MessageActionRow()
//                 .addComponent(TUidCardButton)
//                 .addComponent(VirtualTUidCardButton)
//                 .addComponent(TuPortalButton)
//                 .addComponent(CancelButton)

//             // DM USER THE EMBED
//             // ({ embeds: [ticketEmbed], component: initialButtonRow })


//             // MESSAGE TICKET CHANNEL

//         }

//     // INITIAL TICKET PROMPT
//         // PHYSICAL TUID CARD BUTTON
//         if(button.id ==="physical_TUid_Card") {
//             button.defer()
            
//             // FOR TESTING - DELETE THIS LINE
//             button.channel.send({ content: `You have clicked the \`\`Physical TUid Card\`\` button.` })

//             // GENERATE NEW EMBED FOR PHYSICAL TUID CARD

//         }

//         // VIRTUAL TUID CARD BUTTON
//         if(button.id ==="virtual_TUid_Card") {
//             button.defer()
            
//             // FOR TESTING - DELETE THIS LINE
//             button.channel.send({ content: `You you have clicked the \`\`Virtual TUid Card\`\` button.` })

//             // GENERATE NEW EMBED FOR VIRTUAL TUID CARD

//         }
        
//         // TUPORTAL BUTTON
//         if(button.id ==="TU_portal") {
//             button.defer()
            
//             // FOR TESTING - DELETE THIS LINE
//             button.channel.send({ content: `You have clicked the \`\`TUportal\`\` button.` })

//             // GENERATE NEW EMBED FOR TU PORTAL

//         }

//         // QUIT BUTTON
//         if(button.id ==="quit") {
//             button.defer()
            
//             // FOR TESTING - DELETE THIS LINE
//             button.channel.send({ content: `You have clicked the \`\`Quit Verification\`\` button.` })

//             // CLOSE TICKET

//         }







// 	},
// };