const discord = require('discord.js')
const config = require ('../../config.json')
const blacklistSchema = require('../../Database/blacklistSchema');
const paginationEmbed = require('discordjs-button-pagination');
const { MessageEmbed , MessageButton} = require('discord.js');



module.exports = {
    name: 'blacklist',
    description: 'MODERATOR | Add or remove string from the blacklist or view the current list. [10s]',
    options: [
        {
            name: `add`,
            description: `Adds a string to the blacklist!`,
            type: `SUB_COMMAND`,
            options: [
                {
                    name: `string`,
                    description: `The content to be blacklisted.`,
                    type: `STRING`,
                    required: true
                },
            ],
        },{
            name: `remove`,
            description: `Removes a string from the blacklist!`,
            type: `SUB_COMMAND`,
            options: [
                {
                    name: `string`,
                    description: `The content to remove from the blacklisti.`,
                    type: `STRING`,
                    required: true
                },
            ]
        },{
            name: `list`,
            description: `Generates a list of the current blacklist entries using the server collection.`,
            type: `SUB_COMMAND`,
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
            let stringReformatted = stringToAdd.replace(/\s+/g, '').toLowerCase()


            // SEARCHING DATABASE USING SUGGESTIONNUM TO GET SUGGESTION
            blacklistSchema.findOne(interaction.guild.id, async(err, data) => { 
                // GUILD ENTRY EXISTS
                if(data) {
                    // STRING EXISTS FOR GUILD
                    if(data.FILTER_LIST.includes(stringReformatted)) {

                        // GENERATE ERROR EMBED
                        let termExistsEmbed = new discord.MessageEmbed()
                            .setColor(config.embedRed)
                            .setTitle(`${config.emjREDTICK} Error!`)
                            .setDescription(`Sorry ${interaction.user.username}, \`\`${stringToAdd}\`\` or a variation of this string already exists in the filter.`)
                            .setTimestamp()
                    
                        // SENDING MESSAGE
                        return interaction.reply({ embeds: [termExistsEmbed] })
                    }

                    // STRING DOES NOT EXIST FOR GUILD
                    data.FILTER_LIST.push(stringReformatted)
                    data.save();
                    client.blacklist.get(interaction.guild.id).push(stringReformatted)

                    // CONFIRMATION EMBED
                    let confirmationEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGreen)
                        .setTitle(`${config.emjGREENTICK} Success!`)
                        .setDescription(`The string \`\`${stringToAdd}\`\` has been added to my blacklist filter. Regular users will not be able to use \`\`${stringReformatted}\`\` in their message, regardless how many spaces they put between characters.`)
                        .setTimestamp()
                
                    // SENDING MESSAGE
                    return interaction.reply({ embeds: [confirmationEmbed] })
                }
                
                // GUILD ENTRY DNE
                else {
                    // CREATING DB ENTRY, ADDING TERM
                    await blacklistSchema.findOneAndUpdate({
                        GUILD_ID: interaction.guild.id,
                        FILTER_LIST: []
                    },{
                        GUILD_ID: interaction.guild.id,
                        FILTER_LIST: [stringReformatted]
                    },{
                        upsert: true
                    }).exec();


                    // SETTING COLLECTION WITH stringReformatted AS FIRST ARRAY ENTRY
                    client.blacklist.set(interaction.guild.id, [stringReformatted])
                }
            })
        }


        /*******************/
        /* REMOVE          */
        /*******************/
        if(subCmdName == 'remove') {

            // GETTING OPTIONS VALUES
            let stringToAdd = interaction.options.getString('string');
            let stringReformatted = stringToAdd.replace(/\s+/g, '').toLowerCase()


            // SEARCHING DATABASE USING SUGGESTIONNUM TO GET SUGGESTION
            blacklistSchema.findOne(interaction.guild.id, async(err, data) => { 
                // GUILD ENTRY EXISTS
                if(data) {
                    // STRING EXISTS FOR GUILD
                    if(data.FILTER_LIST.includes(stringReformatted)) {

                        // GENERATE ERROR EMBED
                        let termExistsEmbed = new discord.MessageEmbed()
                            .setColor(config.embedRed)
                            .setTitle(`${config.emjREDTICK} Error!`)
                            .setDescription(`Sorry ${interaction.user.username}, I do not have any blacklisted strings saved to my database.`)
                            .setTimestamp()
                    
                        // SENDING MESSAGE
                        return interaction.reply({ embeds: [termExistsEmbed] })
                    }

                    // FILTERING ARRAY TO GET STRING TO REMOVE FROM DB AND COLLECTION
                    const refilteredList = data.FILTER_LIST.filter((target) => target !== stringReformatted)
                    
                    // DB REMOVAL
                    await blacklistSchema.findOneAndUpdate(guild, {
                        GUILD_ID: interaction.guild.id,
                        FILTER_LIST: refilteredList
                    })

                    // COLLECTION REMOVAL
                    client.blacklist.get(interaction.guild.id).filter((target) => target !== stringReformatted)


                    // CONFIRMATION EMBED
                    let confirmationEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGreen)
                        .setTitle(`${config.emjGREENTICK} Success!`)
                        .setDescription(`The string \`\`${stringToAdd}\`\` has been removed from my blacklist filter. Regular users will be able to use \`\`${stringReformatted}\`\` in their message, regardless how many spaces they put between characters.`)
                        .setTimestamp()
                
                    // SENDING MESSAGE
                    return interaction.reply({ embeds: [confirmationEmbed] })
                }
            })
        }

        /*******************/
        /* LIST            */
        /*******************/
        if(subCmdName == 'list') {
            // const getCollection = client.blacklist.get(interaction.guild.id)

            const embed1 = new discord.MessageEmbed()
                            .setTitle('Blacklist Terms')
                            .setDescription('Page 1');
            
            const embed2 = new discord.MessageEmbed()
                            .setTitle('Blacklist Terms')
                            .setDescription('Page 2');
            
            const prevBtn = new MessageButton()
                            .setCustomId('previousbtn')
                            .setLabel('⇐')
                            .setStyle('DANGER');
            
            const nextBtn = new MessageButton()
                            .setCustomId('nextbtn')
                            .setLabel('⇒')
                            .setStyle('SUCCESS');
            
            // Create an array of embeds
            pagesArr = [
                embed1,
                embed2,
            ];
            
            //create an array of buttons
            
            buttonArr = [
                prevBtn,
                nextBtn
            ]
            
            
            // Call the paginationEmbed method, first three arguments are required
            // timeout is the time till the reaction collectors are active, after this you can't change pages (in ms), defaults to 120000
            paginationEmbed(interaction, pagesArr, buttonArr, 60000);
        }
    }
}