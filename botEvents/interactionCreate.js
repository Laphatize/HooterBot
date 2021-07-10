const discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js');
const config = require ('../config.json');
const guildSchema = require('../Database/guildSchema');
const ticketSchema = require('../Database/ticketSchema');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {

        // IGNORNING NON-BUTTON INTERACTIONS
        if(!interaction.isButton()) return;

        // GETTING PERSON WHO CLICKED BUTTON (OBJECT)
        let clickUser = await interaction.user.fetch();   // user = @MrMusicMan789 (OBJECT)
        let clickUserTag = clickUser.tag;                    // clickUserTag = MrMusicMan789#0789
        let clickUsername = clickUser.username;              // clickUsername = MrMusicMan789
        let clickUserId = clickUser.id;                      // clickUserID = 472185023622152203


        // INITIAL VERIFICATION PROMPT - SET VIA FILTER FOR CUSTOMID - NO TIMEOUT SET
        const filter = i => i.customId === 'begin_verification_button'
        interaction.channel.awaitMessageComponent({ filter })
            .then(i => {
                interaction.channel.send(`${clickUser}, you have pressed the "Begin Verification" button.`)
                console.log(`The "Begin Verification" button has been clicked by ${clickUser}.`) 
            })

        // INITIAL VERIFICATION PROMPT - SET VIA FILTER FOR CUSTOMID - NO TIMEOUT SET

	},
};