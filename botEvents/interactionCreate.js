const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js');
const config = require ('../config.json');
const guildSchema = require('../Database/guildSchema');
const ticketSchema = require('../Database/ticketSchema');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {

        // IGNORNING NON-BUTTON INTERACTIONS
        if(interaction.isButton()) {

            // GETTING PERSON WHO CLICKED BUTTON (OBJECT)
            let clickUser = await interaction.user.fetch();   // user = @MrMusicMan789 (OBJECT)
            let clickUserTag = clickUser.tag;                    // clickUserTag = MrMusicMan789#0789
            let clickUsername = clickUser.username;              // clickUsername = MrMusicMan789
            let clickUserId = clickUser.id;                      // clickUserID = 472185023622152203

            console.log(`clickUser = ${clickUser}`);
            console.log(`clickUserTag = ${clickUserTag}`);
            console.log(`clickUsername = ${clickUsername}`);
            console.log(`clickUserId = ${clickUserId}`);


            // INITIAL VERIFICATION PROMPT - SET VIA FILTER FOR CUSTOMID - NO TIMEOUT
            if(interaction.customId === 'begin_verification_button') {

                // CHECK USER PERMS FOR VERIFIED ROLE
                // GRAB ROLE FROM GUILD CACHE
                const verifiedRole = interaction.user.roles.cache.find((role) => role.name === 'verified')
                console.log(`verifiedRole = ${verifiedRole}`)

                // CHECK
                if(clickUser.roles.has(verifiedRole)) {

                    console.log(`${clickUsername} has started verification but already possesses the verified role!`)

                    // IF VERIFIED, CANCEL AND RESPOND
                    interaction.reply({ content: `Sorry, you're already verified!\n(If this is an error, please submit a ModMail ticket and let us know.)`, ephemeral: true })
                }

                // EMPHEMERAL REPLY TO BUTTON PRESS TO LET USER KNOW TO CHECK THEIR DMS
                interaction.reply({ content: '**Verification started!** Please check for a DM from HooterBot to complete your verification.', ephemeral: true })


                // CREATE TICKET CHANNEL

                // LOG DATABASE INFORMATION FOR TICKET

                // DMING USER TEST
                interaction.user.send(`${clickUser}, you have pressed the "Begin Verification" button.\nclickUserTag = ${clickUserTag}\nclickUsername = ${clickUsername}\nclickUserId = ${clickUserId}\nClick date = ${Date.now()}`)
                console.log(`The "Begin Verification" button has been clicked by ${clickUser}.`)



            }

            // INITIAL VERIFICATION PROMPT - SET VIA FILTER FOR CUSTOMID - NO TIMEOUT SET











        }
	},
};