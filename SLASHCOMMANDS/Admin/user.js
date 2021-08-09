const discord = require('discord.js')
const config = require ('../../config.json')
const birthdaySchema = require('../../Database/birthdaySchema');
const levels = require('discord-xp');
const moment = require('moment');

// COMMAND ID: 874104396265431080

module.exports = {
    name: 'user',
    description: 'Commands regarding server members',
    options: [
        {
            // USER BIRTHDAY
            name: `birthday`,
            description: `MODERATOR | A command for admins/mods to migrate MEE6's birthdays over to HooterBot.`,
            type: 'SUB_COMMAND',
            options: [
                {
                    name: `user`,
                    description: `The user who's birthday you're migrating.`,
                    type: `USER`,
                    required: true
                },{
                    name: `month`,
                    description: `The two-digit month value.`,
                    type: `INTEGER`,
                    required: true
                },{
                    name: `day`,
                    description: `The two-digit day value.`,
                    type: `INTEGER`,
                    required: true
                }
            ]
        },{
            // INFO
            name: `info`,
            description: `MODERATOR | A command for generating information about a specific user in the server.`,
            type: 'SUB_COMMAND',
            options: [
                {
                    name: `user`,
                    description: `The user to generate information about.`,
                    type: `USER`,
                    required: true
                },
            ],    
        },{
            // LEVEL IMPORT
            name: `levelimport`,
            description: `MODERATOR | Import MEE6 Leaderboard values for up to 10 users at a time.`,
            type: 'SUB_COMMAND',
            options: [
                {
                    name: `user1`,
                    description: `The user who's XP is being imported.`,
                    type: `USER`,
                    required: true
                },{
                    name: `xp_value1`,
                    description: `The XP value the user currently has.`,
                    type: `INTEGER`,
                    required: true
                },{
                    name: `user2`,
                    description: `The user who's XP is being imported.`,
                    type: `USER`,
                    required: false
                },{
                    name: `xp_value2`,
                    description: `The XP value the user currently has.`,
                    type: `INTEGER`,
                    required: false
                },{
                    name: `user3`,
                    description: `The user who's XP is being imported.`,
                    type: `USER`,
                    required: false
                },{
                    name: `xp_value3`,
                    description: `The XP value the user currently has.`,
                    type: `INTEGER`,
                    required: false
                },{
                    name: `user4`,
                    description: `The user who's XP is being imported.`,
                    type: `USER`,
                    required: false
                },{
                    name: `xp_value4`,
                    description: `The XP value the user currently has.`,
                    type: `INTEGER`,
                    required: false
                },{
                    name: `user5`,
                    description: `The user who's XP is being imported.`,
                    type: `USER`,
                    required: false
                },{
                    name: `xp_value5`,
                    description: `The XP value the user currently has.`,
                    type: `INTEGER`,
                    required: false
                },{
                    name: `user6`,
                    description: `The user who's XP is being imported.`,
                    type: `USER`,
                    required: false
                },{
                    name: `xp_value6`,
                    description: `The XP value the user currently has.`,
                    type: `INTEGER`,
                    required: false
                },{
                    name: `user7`,
                    description: `The user who's XP is being imported.`,
                    type: `USER`,
                    required: false
                },{
                    name: `xp_value7`,
                    description: `The XP value the user currently has.`,
                    type: `INTEGER`,
                    required: false
                },{
                    name: `user8`,
                    description: `The user who's XP is being imported.`,
                    type: `USER`,
                    required: false
                },{
                    name: `xp_value8`,
                    description: `The XP value the user currently has.`,
                    type: `INTEGER`,
                    required: false
                },{
                    name: `user9`,
                    description: `The user who's XP is being imported.`,
                    type: `USER`,
                    required: false
                },{
                    name: `xp_value9`,
                    description: `The XP value the user currently has.`,
                    type: `INTEGER`,
                    required: false
                },{
                    name: `user10`,
                    description: `The user who's XP is being imported.`,
                    type: `USER`,
                    required: false
                },{
                    name: `xp_value10`,
                    description: `The XP value the user currently has.`,
                    type: `INTEGER`,
                    required: false
                }
            ],
        },
    ],
    permissions: 'MANAGE_MESSAGES',
    dmUse: false,
    cooldown: 0,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // console.log(`user command ID: ${interaction.commandId}`)

        // GRAB SUBCOMMAND
        let subCmdName = interaction.options.getSubcommand()


        /*******************/
        /* BIRTHDAY        */
        /*******************/
        if(subCmdName == 'birthday') {

            // GETTING OPTIONS VALUES
            let birthdayUser = interaction.options.getUser('user');
            let birthdayMonth = interaction.options.getInteger('month');
            let birthdayDay = interaction.options.getInteger('day');


            // CHECK DATABASE FOR ENTRY
            const dbBirthdayData = await birthdaySchema.findOne({
                USER_ID: birthdayUser.id
            }).exec();


            // IF A DB ENTRY EXISTS FOR THE USER ALREADY
            if(dbBirthdayData) {
                let birthdayExists = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`${birthdayUser}'s birthday already exists in the database.`)
                    .setFooter(`If this is a bug, please let ${config.botAuthorUsername} know.`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [birthdayExists], ephemeral: true })
            }


            // CHECKING DAY HAS VALID RANGE
            if(birthdayMonth < 1 || birthdayMonth > 12) {
                let monthRangeEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`The value for the month is outside possible values. Please make sure the month is between 01 and 12.`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [monthRangeEmbed], ephemeral: true })
            }


            // CHECKING DAY HAS VALID RANGE
            if(birthdayDay < 1 || birthdayDay > 31) {
                let dayRangeEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjREDTICK} **Error!**`)
                    .setDescription(`The value for the day is outside possible values. Please make sure the day is between 01 and 31.`)

                // SENDING TO CHANNEL
                return interaction.reply({ embeds: [dayRangeEmbed], ephemeral: true  })
            }


            // IF BIRTHDAY IS FEBRUARY 29 - LEAP YEAR DAY, RECOGNIZE BIRTHDAY ON FEBRUARY 28
            if(birthdayDay == 29 && birthdayMonth == 2) {
                let dayRangeEmbed = new discord.MessageEmbed()
                    .setColor(config.embedTempleRed)
                    .setTitle(`${config.emjORANGETICK} A leap year!`)
                    .setDescription(`Because ${birthdayUser}'s birthday *technically* happens once every 4 years, I'm going to remind everyone of your birthday on February 28 instead so we can celebrate every year!`)

                // SENDING NOTICE TO CHANNEL
                interaction.reply({ embeds: [dayRangeEmbed], ephemeral: true })


                // LOG DATABASE INFORMATION FOR BIRTHDAY
                await birthdaySchema.findOneAndUpdate({
                    USER_ID: interaction.user.id
                },{
                    USER_ID: interaction.user.id,
                    MONTH: 2,
                    DAY: 28
                },{
                    upsert: true
                }).exec();

                // FOR MONTH NUMBER TO NAME
                var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]


                // CHANNEL CONFIRMATION
                let bdaySetEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGreen)
                    .setTitle(`${config.emjGREENTICK} **Birthday Saved!**`)
                    .setDescription(`I'll remember ${birthdayUser}'s birthday on ${monthNames[birthdayMonth-1]} ${birthdayDay-1}, even though their birthday is actually on February 29.
                    \n*If you ever wish for me to forget your birthday, use* \`\`/forgetbirthday\`\`.`)

                return interaction.followUp({ embeds: [bdaySetEmbed] });
            }


            // LOG DATABASE INFORMATION FOR BIRTHDAY
            await birthdaySchema.findOneAndUpdate({
                USER_ID: interaction.user.id
            },{
                USER_ID: interaction.user.id,
                MONTH: birthdayMonth,
                DAY: birthdayDay
            },{
                upsert: true
            }).exec();


            // FOR MONTH NUMBER TO NAME
            var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]


            // CHANNEL CONFIRMATION
            let bdaySetEmbed = new discord.MessageEmbed()
                .setColor(config.embedGreen)
                .setTitle(`${config.emjGREENTICK} **Birthday Saved!**`)
                .setDescription(`I'll remember ${birthdayUser}'s birthday on ${monthNames[birthdayMonth-1]} ${birthdayDay}.
                \n*If you ever wish for me to forget your birthday, use* \`\`/forgetbirthday\`\`.`)
            
            return interaction.reply({ embeds: [bdaySetEmbed] });
        }


        /*******************/
        /* INFO            */
        /*******************/
        if(subCmdName == 'info') {
            // GETTING OPTIONS VALUES
            let infoUser = interaction.options.getUser('user');

            // FETCH GUILD MEMBER
            interaction.guild.members.fetch(infoUser.id)
                .then(async user => {
                    let member = client.users.cache.find(user => user.id === infoUser.id)
                    
                    const flags = await member.fetchFlags()
                    var userFlags = flags.toArray()

                    if(userFlags) {
                        userFlags = `${userFlags.join(`\n`)}`
                    }

                    // GRABBING NICKNAME IF SET
                    var nickname = user.displayName
                    if(user.displayName == user.username) {
                        nickname = `*(None)*`;
                    }

                    var booster = moment( new Date(member.premiumSince)).format('LL')
                    if(booster == 'Invalid date') {
                        booster =  `*(N/A)*`
                    }

                    const userRoles = user.roles.cache
                        .map(role => role.toString())
                        .slice(0, -1)


                    let userInfoEmbed = new discord.MessageEmbed()
                        .setColor(config.embedDarkGrey)
                        .setAuthor(`${member.tag} Information`, `${member.displayAvatarURL({ dynamic:true })}`)
                        .addField(`Username:`, `${member.username}`, true)
                        .addField(`ID:`, `${member.id}`, true)
                        .addField(`Nickname:`, `${nickname}`, true)
                        .addField(`Server Boosting:`, `${booster}`, true)
                        .addField(`Server Join Date:`, `${moment(user.joinedAt).format(`LLL`)}`, true)
                        .addField(`Discord Join Date:`, `${moment(member.createdTimestamp).format(`LL`)}`, true)
                        .addField(`Server Roles:`, `${userRoles.join('\n')}`, true)
                        .addField(`Flags:`, `\`\`${userFlags || `(None)`}\`\``, true)
                        .addField(`Bot?`, `${member.bot}`, true)

                    return interaction.reply({ embeds: [userInfoEmbed], ephemeral: true });
                })
        }


        /*******************/
        /* LEVEL IMPORT    */
        /*******************/   
        if(subCmdName == 'levelimport') {
            // USERS
            let user1Id = interaction.options.getUser('user1').id;
            let user2Id = interaction.options.getUser('user2').id;
            let user3Id = interaction.options.getUser('user3').id;
            let user4Id = interaction.options.getUser('user4').id;
            let user5Id = interaction.options.getUser('user5').id;
            let user6Id = interaction.options.getUser('user6').id;
            let user7Id = interaction.options.getUser('user7').id;
            let user8Id = interaction.options.getUser('user8').id;
            let user9Id = interaction.options.getUser('user9').id;
            let user10Id = interaction.options.getUser('user10').id;

            // XP
            let xp1 = interaction.options.getUser('user1');
            let xp2 = interaction.options.getUser('user2');
            let xp3 = interaction.options.getUser('user3');
            let xp4 = interaction.options.getUser('user4');
            let xp5 = interaction.options.getUser('user5');
            let xp6 = interaction.options.getUser('user6');
            let xp7 = interaction.options.getUser('user7');
            let xp8 = interaction.options.getUser('user8');
            let xp9 = interaction.options.getUser('user9');
            let xp10 = interaction.options.getUser('user10');


            levels.appendXp(user1Id, interaction.guild.id, xp1);
            if(user2Id) {
                levels.appendXp(user2Id, interaction.guild.id, xp2);
            } if(user3Id) {
                levels.appendXp(user3Id, interaction.guild.id, xp3);
            } if(user4Id) {
                levels.appendXp(user4Id, interaction.guild.id, xp4);
            } if(user5Id) {
                levels.appendXp(user5Id, interaction.guild.id, xp5);
            } if(user6Id) {
                levels.appendXp(user6Id, interaction.guild.id, xp6);
            } if(user7Id) {
                levels.appendXp(user7Id, interaction.guild.id, xp7);
            } if(user8Id) {
                levels.appendXp(user8Id, interaction.guild.id, xp8);
            } if(user9Id) {
                levels.appendXp(user9Id, interaction.guild.id, xp9);
            } if(user10Id) {
                levels.appendXp(user10Id, interaction.guild.id, xp10);
            }

            // CONFIRMATION
            interaction.reply({ content: 'The user(s) XP has been added to the database.', ephemeral: true })
        }
    }
}