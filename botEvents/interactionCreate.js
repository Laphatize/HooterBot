const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js');
const config = require ('../config.json');
const guildSchema = require('../Database/guildSchema');
const ticketSchema = require('../Database/ticketSchema');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {

        // IGNORNING NON-BUTTON INTERACTIONS
        if(interaction.isButton()) {


            /***********************************************************/
            /*      BEGIN VERIFICATION (INITIAL PROMPT in #ROLES)      */
            /***********************************************************/
            if(interaction.customId === 'begin_verification_button') {

                console.log(`interaction.member =${interaction.member}`)

                
                // CHECK IF USER HAS VERIFIED ROLE
                if(interaction.member.roles.cache.some((role) => role.id === config.verifiedRoleID)) {

                    // CANCEL AND RESPOND WITH EPHEMERAL SINCE USER DOES NOT NEED TO VERIFY AGAIN
                    return interaction.reply({ content: `Sorry, you're **already verified!**\n*(If this is an error, please submit a ModMail ticket and let us know.)*`, ephemeral: true })
                }

                // EMPHEMERAL REPLY TO BUTTON PRESS - LET USER KNOW TO CHECK THEIR DMS
                interaction.reply({ content: `**Verification started!** Please check for a DM from HooterBot to complete your verification.\n***Didn't receive a DM?*** Make sure you allow DMs from server members in your privacy settings.`, ephemeral: true })
                    .catch(err => console.log(err));


                // CREATE TICKET CHANNEL

                    // *****NEED TO ADD*****


                // LOG DATABASE INFORMATION FOR TICKET

                    // *****NEED TO ADD*****


                // GENERATING INITIAL EMBED FOR DM
                let ticketEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`**Verification - Ticket Opened**`)
                    .setDescription(`Thanks for wanting to verify in the <:TempleT:857293539779018773> **Temple University server**.
                        \nThere are three ways you can verify you are a student or employee:
                        \n${config.indent}**1.** Use a physical TUid card
                        \n${config.indent}**2.** Use a virtual TUid card
                        \n${config.indent}**3.** Using TUportal
                        \n\nSelect the method using the buttons below to receive instructions. You can quit verification at any time using the red "Quit Verification" button.\n`)

                // INITIALIZING BUTTON
                let TUidCardButton = new MessageButton()
                    .setLabel("Physical TUid Card")
                    .setStyle("SECONDARY")
                    .setCustomId("physical_TUid_Card")
                    .setDisabled(false)
                let VirtualTUidCardButton = new MessageButton()
                    .setLabel("Virtual TUid Card")
                    .setStyle("SECONDARY")
                    .setCustomId("virtual_TUid_Card")
                    .setDisabled(false)
                let TuPortalButton = new MessageButton()
                    .setLabel("TUportal")
                    .setStyle("SECONDARY")
                    .setCustomId("TU_portal")
                    .setDisabled(false)
                let CancelButton = new MessageButton()
                    .setLabel("Quit Verification")
                    .setStyle("DANGER")
                    .setCustomId("quit")
                    .setDisabled(false)

                // BUTTON ROW
                let buttonRow = new MessageActionRow()
                .addComponents(
                    TUidCardButton,
                    VirtualTUidCardButton,
                    TuPortalButton,
                    CancelButton
                );

                // DMING USER THE INITIAL VERIFICATION PROMPT
                interaction.user.send({embeds: [ticketEmbed], components: [buttonRow] })
                    .catch(err => console.log(err))
            }
            // END OF "BEGIN VERIFICATION" PROMPT BUTTON


            // /***********************************************************/
            // /*      QUIT VERIFICATION (ANY PROMPT IN DMS)              */
            // /***********************************************************/
            // if(interaction.customId === 'quit') {

            //     // GENERATING QUIT CONFIRMATION EMBED FOR DM
            //     let quitConfirmEmbed = new discord.MessageEmbed()
            //         .setColor(config.embedTempleRed)
            //         .setTitle(`**Close confirmation.**`)
            //         .setDescription(`Please confirm ticket cancellation.`)

            //     // INITIALIZING BUTTON
            //     let quitConfirmButton = new MessageButton()
            //         .setLabel("Yes, Quit")
            //         .setStyle("DANGER")
            //         .setCustomId("quit_confirmation")
            //     let cancelQuitButton = new MessageButton()
            //         .setLabel("Cancel")
            //         .setStyle("SECONDARY")
            //         .setCustomId("cancel_quit")
        
            //     // BUTTON ROW
            //     let buttonRow = new MessageActionRow()
            //     .addComponents(
            //         quitConfirmButton
            //     );

            //     // DMING USER THE INITIAL QUIT PROMPT
            //     interaction.user.send({embeds: [quitConfirmEmbed], components: [buttonRow, cancelQuitButton] })
            //         .catch(err => console.log(err))
            // }
            // // END OF "QUIT" BUTTON


            /***********************************************************/
            /*      QUIT CONFIRM (2nd QUIT IN DMS)                     */
            /***********************************************************/
            if(interaction.customId === 'quit_confirmation') {

                // DELETING DATABASE ENTRY

                    // *****NEED TO ADD*****

                // GENERATING QUIT CONFIRMATION EMBED FOR DM
                let quitConfirmedEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`**${config.emjGREENTICK} Ticket Closed.**`)
                    .setDescription(`Your verification ticket has been closed. The information in this DM has been purged from the bot.
                    \n\nIf you wish to verify later, please open a new ticket using the verification prompt in <#${config.rolesChannelId}>.`)

                // DMING USER THE QUIT CONFIRMATION
                interaction.user.send({embeds: [quitConfirmedEmbed] })
                    .catch(err => console.log(err))
            }
            // END OF "QUIT CONFIRM" BUTTON
































        }
	},
};