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

            // INITIAL VERIFICATION PROMPT - SET VIA FILTER FOR CUSTOMID - NO TIMEOUT
            if(interaction.customId === 'begin_verification_button') {

                // GRAB VERIFIED ROLE FROM GUILD
                const verifiedRole = await interaction.guild.roles.cache.find((role) => role.name === 'verified')

                // CHECK IF USER HAS VERIFIED ROLE
                if(interaction.member.roles.cache.has(verifiedRole)) {

                    console.log(`${interaction.member.fetch().username} has started verification but already possesses the verified role!`)

                    // CANCEL AND RESPOND WITH EPHEMERAL
                    return interaction.reply({ content: `Sorry, you're already verified!\n(If this is an error, please submit a ModMail ticket and let us know.)`, ephemeral: true })
                }

                // EMPHEMERAL REPLY TO BUTTON PRESS - LET USER KNOW TO CHECK THEIR DMS
                interaction.reply({ content: `**Verification started!** Please check for a DM from HooterBot to complete your verification.\n***Didn't receive a DM?*** Make sure you allow DMs from server members in your privacy settings.`, ephemeral: true })
                    .catch(err => console.log(err));


                // CREATE TICKET CHANNEL

                // LOG DATABASE INFORMATION FOR TICKET


                // GENERATING INITIAL EMBED FOR DM
                let ticketEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`**Verification - Ticket Opened**`)
                    .setDescription(`Thanks for wanting to verify in the <:TempleT:857293539779018773> Temple University server.
                        \nThere are three ways you can verify you are a student or employee:
                        \n${config.indent}**1.** Use a physical TUid card
                        \n${config.indent}**2.** Use a virtual TUid card
                        \n${config.indent}**3.** Using TUportal
                        \n\nSelect the method using the buttons below to receive instructions. You can quit verification at any time using the red "Quit Verification" button.\n`)
                    .setFooter("If these buttons stop working, (?).")

                // INITIALIZING BUTTON
                let TUidCardButton = new MessageButton()
                    .setLabel("Physical TUid Card")
                    .setStyle("SECONDARY")
                    .setCustomId("physical_TUid_Card")
                let VirtualTUidCardButton = new MessageButton()
                    .setLabel("Virtual TUid Card")
                    .setStyle("SECONDARY")
                    .setCustomId("virtual_TUid_Card")
                let TuPortalButton = new MessageButton()
                    .setLabel("TUportal")
                    .setStyle("SECONDARY")
                    .setCustomId("TU_portal")
                let CancelButton = new MessageButton()
                    .setLabel("Quit Verification")
                    .setStyle("DANGER")
                    .setCustomId("quit")

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

            // INITIAL VERIFICATION PROMPT - SET VIA FILTER FOR CUSTOMID - NO TIMEOUT SET











        }
	},
};