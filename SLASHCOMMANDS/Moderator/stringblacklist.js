const discord = require('discord.js')
const config = require ('../../config.json')
const blacklistSchema = require('../../Database/blacklistSchema');
const paginationEmbed = require('discordjs-button-pagination');
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
            description: `MODERATOR | Generates a list of the current blacklist entries using the server collection, paginated.`,
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
                client.blacklist.get(interaction.guild.id).push(stringReformatted)

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

                    // COLLECTION REMOVAL
                    client.blacklist.get(interaction.guild.id).filter((target) => target !== stringReformatted)

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
            const getCollection = client.blacklist.get(interaction.guild.id)

            console.log(`getCollection = ${getCollection}`)


            // EMPTY BLACKLIST
            if(!getCollection || getCollection === 'undefined' || !dbBlacklistData.FILTER_LIST) {
                
                
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
                let termsArray = Array.from(getCollection.values())

                termsArray.sort();

                interaction.reply({ content: `**termsArray.join('\n'):**\n\`\`\`${termsArray.join(`\n`)}\`\`\`` })

                // const embed1 = new discord.MessageEmbed()
                //     .setTitle('Blacklist Terms – Page 1')
                //     .setColor(config.embedDarkBlue)
                //     .setDescription('(page 1 content)');
                
                // const embed2 = new discord.MessageEmbed()
                //     .setTitle('Blacklist Terms – Page 2')
                //     .setColor(config.embedDarkBlue)
                //     .setDescription('(page 2 content)');
                
                // const prevBtn = new MessageButton()
                //     .setCustomId('previousbtn')
                //     .setLabel('🡸 Back')
                //     .setStyle('PRIMARY');
                
                // const nextBtn = new MessageButton()
                //     .setCustomId('nextbtn')
                //     .setLabel('Next 🡺')
                //     .setStyle('PRIMARY')
                
            //     for (let i = 0; i < termsArray.length; i+= 10) {
                            
            //     const embeds = data.map((x) => {
                    
            //         return new MessageEmbed()
            //             .setColor(config.embedBlurple)
            //             .addField(x)
            //             .addField("Gender", x.gender)
            //             .addField("Email", x.email)
            //             .addField("Date of Birth", new Date(x.dob).toDateString())
            //             .addField("Age", x.age.toString())
            //             .addField("Phone", x.phone)
            //             .setThumbnail(x.image);
            //     });

                
            //     buttonArr = [
            //         prevBtn,
            //         nextBtn
            //     ]
                
            //     paginationEmbed(interaction, embeds, buttonArr, 60000);
            }
        }
    }
}