const discord = require('discord.js')
const config = require ('../../config.json')
const blacklistSchema = require('../../Database/blacklistSchema');


module.exports = {
    name: 'blacklist',
    description: 'MODERATOR | Add content to the blacklist or view the current list. [10s]',
    options: [
        {
            name: `add`,
            description: `Adds a string to the blacklist - please use REGEX!`,
            type: `SUB_COMMAND`,
            required: true,
            options: [
                {
                    name: `string`,
                    description: `The content to be blacklisted.`,
                    type: `STRING`,
                    required: true
                },
            ]
        },{
            name: `list`,
            description: `Generates a list of the current blacklist entries.`,
            type: `SUB_COMMAND`,
            required: false
        }
    ],
    permissions: 'MANAGE_MESSAGES',
    dmUse: false,
    cooldown: 10,
    defaultPermission: false,
    run: async(client, interaction, inputs) => {


        // MESSAGE SENT IN INVALID CATEGORY
        if (interaction.channel.parent.id !== '829420812951748628') {

            // GENERATE ERROR EMBED
            let wrongChannelsEmbed = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Error!`)
                .setDescription(`Sorry, this command can only be run in the \`\`MOD-CHANNELS\`\` category of the Temple Server.`)
                .setTimestamp()
        
            // SENDING MESSAGE
            return interaction.reply({ embeds: [wrongChannelsEmbed], ephemeral: true })
        }


        // GRAB SUBCOMMAND
        let subCmdName = interaction.options.getSubcommand()


        /*******************/
        /* ADD             */
        /*******************/
        if(subCmdName == 'add') {

            // GETTING OPTIONS VALUES
            let stringToAdd = interaction.options.getString('string');

            client.blacklist

            // SEARCHING DATABASE USING SUGGESTIONNUM TO GET SUGGESTION
            const dbBlacklistData = blacklistSchema;

            console.log(`dbBlacklistData = ${dbBlacklistData}`)
        }

        /*******************/
        /* LIST            */
        /*******************/
        if(subCmdName == 'list') {

        }
    }
}