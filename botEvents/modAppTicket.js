const discord = require('discord.js');
const config = require ('../config.json');


module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {

        /***********************************************************/
        /*      MOD APPLICATION BUTTON                             */
        /***********************************************************/

        // MOD APP CHANNEL NAME
        let modAppChannelName = `modApp-${interaction.user.username.toLowerCase()}-${interaction.user.id}`;
        let parentCategory = interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'mod apps' && ch.type === 'GUILD_CATEGORY')


        // IGNORNING NON-BUTTON INTERACTIONS
        if(interaction.isButton()) {

            if(interaction.customId === 'modAppApply') {
                
                var memberDuration;
                const monthRequirement = (1) * 2628002880

                // GET INTERACTION MEMBER AS GUILD MEMBER
                interaction.guild.members.fetch(interaction.user.id)
                    .then( guildMemberApplicant => {
                        // CALCULATE TIME MEMBER HAS BEEN IN SERVER
                        memberDuration = Math.abs(new Date - new Date(guildMemberApplicant.joinedAt))
                    })


            // USER JOINED LESS THAN 1 MONTH AGO
            if(memberDuration < monthRequirement) {
                return interaction.reply({
                    content: `${config.emjREDTICK} Sorry, you are not eligible to apply at this time. (Member for less than one month)`,
                    ephemeral: true })
            }


            // IF MEMBER IS CURRENTLY MUTED
            if(interaction.member.roles.cache.some((role) => role.name === 'Muted :(')) {
                return interaction.reply({
                    content: `${config.emjREDTICK} Sorry, you are not eligible to apply at this time.`,
                    ephemeral: true })
            }


            // IF MEMBER IS MOD OR ADMIN
            if(interaction.member.roles.cache.some((role) => role.name.toLowerCase() === 'moderator')
            || interaction.member.roles.cache.some((role) => role.name.toLowerCase() === 'admin')) {
                return interaction.reply({
                    content: `${config.emjREDTICK} Sorry, you are not eligible to apply. (You're already in, silly!)`,
                    ephemeral: true })
            }


            // CHECK IF THERE EXISTS A TICKET CHANNEL FOR THE USER CURRENTLY
            if (interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === modAppChannelName)) {
                // CANCEL AND RESPOND WITH EPHEMERAL - USER ALREADY IN VERIFYING PROCESS
                return interaction.reply({
                    content: `${config.emjREDTICK} Sorry, you're **already in the process of applying!** Check ${interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === modAppChannelName)}.`,
                    ephemeral: true })
            }


            // EMPHEMERAL REPLY TO BUTTON PRESS - IF ELIGIBLE TO APPLY
            interaction.reply({ content: `${config.emjGREENTICK} **Application opened!** HooterBot has pinged you in the channel to get started.`, ephemeral: true })
                .catch(err => console.log(err))

            let botRole = interaction.guild.me.roles.cache.find((role) => role.name == 'HooterBot');
            let adminRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() == 'admin');

            // CREATE TICKET CHANNEL USING CLICKER'S USERNAME
            await interaction.guild.channels.create(`${modAppChannelName}`, {
                type: 'GUILD_TEXT',
                parent: parentCategory.id,
                topic: `The moderator application for ${interaction.user.tag} (ID: ${interaction.user.id}).`,
                permissionOverwrites: [
                    {
                        // EVERYONE ROLE - HIDE
                        id: interaction.guild.roles.everyone.id,
                        deny: [`VIEW_CHANNEL`, `USE_PUBLIC_THREADS`, `USE_PRIVATE_THREADS`]
                    },{
                        // ADMINS - VIEW AND RESPOND
                        id: adminRole.id,
                        allow: [`VIEW_CHANNEL`, `SEND_MESSAGES`]
                    },{
                        // USER - VIEW AND RESPOND
                        id: interaction.user.id,
                        allow: [`VIEW_CHANNEL`, `SEND_MESSAGES`]
                    },{
                        // HOOTERBOT ROLE - VIEW AND RESPOND
                        id: botRole.id,
                        allow: [`VIEW_CHANNEL`, `SEND_MESSAGES`]
                    }
                ],
                reason: `User is submitting an application to become a moderator.`
            })
                .then(async modApplicantChannel => {
                    // CREATE INTRO EMBED FOR ADMIN/MOD TICKET CHANNEL
                    let newTicketEmbed = new discord.MessageEmbed()
                        .setColor(config.embedBlurple)
                        .setTitle(`Application Opened:`)
                        .addField(`Applicant:`, `${interaction.user}`, true)
                        .addField(`Applicant Tag:`, `${interaction.user.tag}`, true)
                        .addField(`Applicant ID:`, `${interaction.user.id}`, true)
                        .setDescription(`\nThank you for your interest in our moderator position! To help the admins assess applicants, HooterBot will ask you a few simple questions. Type up your response in a single message and send it in the channel. HooterBot will ask a total of **# questions**, one at a time.`)


                    let modAppQuestionOne = new discord.MessageEmbed()
                        .setColor(config.embedBlurple)
                        .setTitle(`Question 1:`)
                        .setDescription(`**Why do you want to be a moderator?**`)

                    // SENDING INTRO EMBED TO ADMIN/MOD TICKET CHANNEL
                    modApplicantChannel.send({ embeds: [newTicketEmbed, modAppQuestionOne] })
                        .catch(err => console.log(err))
                    })

                            
                    // LOGGING TICKET OPENING IN LOGS CHANNEL
                    let logTicketOpenEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGreen)
                        .setTitle(`${config.emjGREENTICK} Moderator Application Opened`)
                        .addField(`User:`, `${interaction.user}`, true)
                        .addField(`User ID:`, `${interaction.user.id}`, true)
                        .setTimestamp()

                    // LOG ENTRY
                    interaction.guild.channels.cache.find(ch => ch.name === `mod-log`).send({ embeds: [logTicketOpenEmbed] })
                        .catch(err => console.log(err))
            }
        }
	},
};