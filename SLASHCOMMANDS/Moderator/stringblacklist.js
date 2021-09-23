const discord = require('discord.js')
const config = require ('../../config.json')
const blacklistSchema = require('../../Database/blacklistSchema');
const { Pagination } = require("discordjs-button-embed-pagination");
const { MessageButton, MessageActionRow} = require('discord.js');



module.exports = {
    name: 'blacklist',
    description: 'Add or remove string from the blacklist or view the current list. [10s]',
    options: [
        {
            name: `add`,
            description: `ADMINISTRATOR | Adds a string to the blacklist!`,
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
            description: `ADMINISTRATOR | Removes a string from the blacklist!`,
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
            description: `MODERATOR | Generates list of current blacklist entries using the server collection, paginated.`,
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

            if(!interaction.channel.permissionsFor(interaction.user).has('ADMINISTRATOR')) {
                // DEFINING EMBED TO SEND
                let cmdUserPermErrEmbed = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`${config.emjORANGETICK} Sorry!`)
                    .setDescription(`You must have the \`\`ADMINISTRATOR\`\` permission to use this slash command.`)

                return interaction.reply({ embeds: [cmdUserPermErrEmbed], ephemeral: true })
            }


            // GETTING OPTIONS VALUES
            let stringToAdd = interaction.options.getString('string');
            let stringReformatted = stringToAdd.replace(/\s+/g, '').toLowerCase()


            // SEARCHING DATABASE FOR GUILD ENTRY
            let dbBlacklistData = await blacklistSchema.findOne({
                GUILD_ID: interaction.guild.id
            })
            

            // GUILD ENTRY EXISTS
            if(dbBlacklistData) {
                // STRING EXISTS FOR GUILD
                if(dbBlacklistData.FILTER_LIST.includes(stringReformatted)) {

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
                dbBlacklistData.FILTER_LIST.push(stringReformatted)
                dbBlacklistData.save();
                // COLLECTION RESET
                client.blacklist.clear()
                client.blacklist.set(interaction.guild.id, [dbBlacklistData.FILTER_LIST])
                

                // CONFIRMATION EMBED
                let confirmationEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} Blacklist Addition – Success!`)
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

                // CONFIRMATION EMBED
                let confirmationEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} Blacklist Addition – Success!`)
                    .setDescription(`The string \`\`${stringToAdd}\`\` has been added to my blacklist filter. Regular users will not be able to use \`\`${stringReformatted}\`\` in their message, regardless how many spaces they put between characters.`)
                    .setTimestamp()
            
                // SENDING MESSAGE
                return interaction.reply({ embeds: [confirmationEmbed] })
            }
        }


        /*******************/
        /* REMOVE          */
        /*******************/
        if(subCmdName == 'remove') {

            if(!interaction.channel.permissionsFor(interaction.user).has('ADMINISTRATOR')) {
                // DEFINING EMBED TO SEND
                let cmdUserPermErrEmbed = new discord.MessageEmbed()
                    .setColor(config.embedOrange)
                    .setTitle(`${config.emjORANGETICK} Sorry!`)
                    .setDescription(`You must have the \`\`ADMINISTRATOR\`\` permission to use this slash command.`)

                return interaction.reply({ embeds: [cmdUserPermErrEmbed], ephemeral: true })
            }

            // GETTING OPTIONS VALUES
            let stringToAdd = interaction.options.getString('string');
            let stringReformatted = stringToAdd.replace(/\s+/g, '').toLowerCase()


            let dbBlacklistData = await blacklistSchema.findOne({
                GUILD_ID: interaction.guild.id
            })
        
            // GUILD ENTRY EXISTS
            if(dbBlacklistData) {
                // STRING DNE FOR GUILD
                if(!dbBlacklistData.FILTER_LIST.includes(stringReformatted)) {

                    // GENERATE ERROR EMBED
                    let termExistsEmbed = new discord.MessageEmbed()
                        .setColor(config.embedRed)
                        .setTitle(`${config.emjREDTICK} Error!`)
                        .setDescription(`Sorry ${interaction.user.username}, there's nothing to remove – I do not have any blacklisted strings saved to my database.`)
                        .setTimestamp()
                
                    // SENDING MESSAGE
                    return interaction.reply({ embeds: [termExistsEmbed] })
                }

                // STRING EXISTS FOR GUILD
                // FILTERING ARRAY TO GET STRING TO REMOVE FROM DB AND COLLECTION
                const index = dbBlacklistData.FILTER_LIST.indexOf(stringReformatted)
                
                let newArray = [];

                // REMOVING ENTRY FROM ARRAY
                if (index !== -1) {
                    newArray = dbBlacklistData.FILTER_LIST.splice(index, 1);
                
                    interaction.channel.send({ content: `**newArray = **\n ${newArray}` })

                    // DB REMOVAL
                    await blacklistSchema.findOneAndUpdate(interaction.guild.id, {
                        GUILD_ID: interaction.guild.id,
                        FILTER_LIST: newArray
                    })


                    // COLLECTION RESET
                    client.blacklist.clear()
                    client.blacklist.set(interaction.guild.id, [newArray])


                    // CONFIRMATION EMBED
                    let confirmationEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGreen)
                        .setTitle(`${config.emjGREENTICK} Blacklist Removal – Success!`)
                        .setDescription(`The string \`\`${stringToAdd}\`\` has been removed from my blacklist filter. Regular users will be able to use \`\`${stringReformatted}\`\` in their message, regardless how many spaces they put between characters.`)
                        .setTimestamp()
                
                    // SENDING MESSAGE
                    return interaction.reply({ embeds: [confirmationEmbed] })
                }
            }
        }


        /*******************/
        /* LIST            */
        /*******************/
        if(subCmdName == 'list') {
            // SEARCHING DATABASE FOR GUILD ENTRY
            let dbBlacklistData = await blacklistSchema.findOne({
                GUILD_ID: interaction.guild.id
            })


            if(!dbBlacklistData) { 
                // GENERATE EMBED AND DISABLED BUTTONS
                let termsDNEembed = new discord.MessageEmbed()
                    .setTitle('Blacklist Terms')
                    .setColor(config.embedDarkBlue)
                    .setDescription('*(none)*');

                const prevBtn = new MessageButton()
                    .setCustomId('previousbtn')
                    .setLabel('🡸 Back')
                    .setStyle('PRIMARY')
                    .setDisabled(true)
                
                const nextBtn = new MessageButton()
                    .setCustomId('nextbtn')
                    .setLabel('Next 🡺')
                    .setStyle('PRIMARY')
                    .setDisabled(true)

                let disabledBtnRow = new MessageActionRow()
                    .addComponents(
                        prevBtn,
                        nextBtn
                    );

                // SENDING MESSAGE
                return interaction.reply({ embeds: [termsDNEembed], components: [disabledBtnRow] })
            }

            
            // NON-EMPTY BLACKLIST
            else {
                
                let entriesList = dbBlacklistData.FILTER_LIST;

                const chunks = (a, size) =>
                Array.from(
                    new Array(Math.ceil(a.length / size)),
                    (_, i) => a.slice(i * size, i * size + size)
                )

                let listCount = 20

                let arrays = chunks(entriesList, listCount)

                // LESS THAN 20 ENTRIES - 1 PAGE
                if(arrays.length < listCount) {

                    // GENERATE EMBED AND DISABLED BUTTONS
                    let termsDNEembed = new discord.MessageEmbed()
                        .setTitle('Blacklist Terms')
                        .setColor(config.embedDarkBlue)
                        .setDescription(`\`\`${dbBlacklistData.FILTER_LIST.join(`\`\`\n\`\``)}\`\``)
                        .setFooter(`Page 1/1`)

                    const prevBtn = new MessageButton()
                        .setCustomId('previousbtn')
                        .setLabel('🡸 Back')
                        .setStyle('PRIMARY')
                        .setDisabled(true)
                    
                    const nextBtn = new MessageButton()
                        .setCustomId('nextbtn')
                        .setLabel('Next 🡺')
                        .setStyle('PRIMARY')
                        .setDisabled(true)

                    let disabledBtnRow = new MessageActionRow()
                        .addComponents(
                            prevBtn,
                            nextBtn
                        );

                    // SENDING MESSAGE
                    return interaction.reply({ embeds: [termsDNEembed], components: [disabledBtnRow] })
                }

                // MORE THAN 20 ENTRIES - 2+ PAGE
                else {     
                    interaction.reply({ content: `The blacklist is a nonzero array with more than 20 entries, requiring at least 2 pages.\nTotal entries: \`\`${entriesList.length}\`\`` })
                    
                    console.log(arrays)
                    
                    const embeds = arrays.map((x) => {
                        return new MessageEmbed()
                            .setTitle('Blacklist Terms')
                            .setColor(config.embedDarkBlue)
                            .setDescription(`x = ${x}`)
                    });


                    await new Pagination(message.channel, embeds, "page", 60000, [
                        {
                            style: "PRIMARY",
                            label: "∣🡸 First",
                        }, {
                            style: "PRIMARY",
                            label: "🡸 Back",
                        }, {
                            style: "PRIMARY",
                            label: "Next 🡺"
                        }, {
                            style: "PRIMARY",
                            label: "Last 🡺∣",
                        },
        
                    ]).paginate();
                }
            }
        }
    }
}