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

        console.log(`clickUser = ${clickUser}`);
        console.log(`clickUserTag = ${clickUserTag}`);
        console.log(`clickUsername = ${clickUsername}`);
        console.log(`clickUserId = ${clickUserId}`);


        // INITIAL VERIFICATION PROMPT - SET VIA FILTER FOR CUSTOMID - NO TIMEOUT
        if(interaction.customId === 'begin_verification_button') {
            interaction.reply(`${clickUser}, you have pressed the "Begin Verification" button.`)
            console.log(`The "Begin Verification" button has been clicked by ${clickUser}.`) 
        }

        // INITIAL VERIFICATION PROMPT - SET VIA FILTER FOR CUSTOMID - NO TIMEOUT SET

	},
};