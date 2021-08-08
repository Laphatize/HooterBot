const discord = require('discord.js')
const config = require ('../../config.json')
const levels = require('discord-xp');

// COMMAND ID: 871635696207679529

module.exports = {
    name: 'level',
    description: `The XP, level, and leaderboard rank for yourself or a specified user. (🤖｜bot-spam) [10s]`,
    options: [
        {
            name: `user`,
            description: `Find this user's XP and level.`,
            type: `USER`,
            required: false
        }
    ],
    permissions: '',
    dmUse: false,
    cooldown: 10,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // GRABBING SLASH COMMAND INPUT VALUES
        const user = inputs[0];

        
        // BOT-SPAM CHANNEL ONLY
        if(interaction.channel.name !== '🤖｜bot-spam') {

            let botSpamChannel = interaction.guild.channels.cache.find(ch => ch.name.toLowerCase() === '🤖｜bot-spam')

            let wrongChannel = new discord.MessageEmbed()
                .setColor(config.embedRed)
                .setTitle(`${config.emjREDTICK} Sorry!`)
                .setDescription(`You'll have to run this command in <#${botSpamChannel.id}>. Head there and try again!`)

            // POST EMBED
            return interaction.reply({ embeds: [wrongChannel], ephemeral: true })
        }


        // INFO FOR USER ISSUING COMMAND - NO ARGS OR SPECIFYING THEMSELVES
        if(!user || user == interaction.user.id) {
            const selfUser = await levels.fetch(interaction.user.id, interaction.guild.id, true)

            try {
                // IF USER INFO DNE
                if (!selfUser) {
                    // CREATING EMBED FOR RESPONSE        
                    let levelUserNotFoundEmbed = new discord.MessageEmbed()
                        .setColor(config.embedRed)
                        .setTitle(`${config.emjREDTICK} Sorry!`)
                        .setDescription(`I wasn't able to find your level information. Be sure to post a message in the server first!`)
                        .setFooter(`If this is a bug, please submit a ModMail ticket to inform ${config.botAuthorUsername}.`)
    
                    // POST EMBED
                    return interaction.reply({ embeds: [levelUserNotFoundEmbed], ephemeral: true })
                }
    
                // CREATING EMBED FOR RESPONSE        
                let infoEmbed = new discord.MessageEmbed()
                    .setColor(config.embedGrey)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic:true }))
                    .addField(`LEVEL:`, `${selfUser.level}`, true)
                    .addField(`TOTAL XP:`, `${selfUser.xp}`, true)
                    .addField(`LEADERBOARD:`, `#${selfUser.position}`)
    
                // POST EMBED
                return interaction.reply({ embeds: [infoEmbed] })
            }
            catch (err) {
                interaction.reply({ content: `I've encountered an error running this command. Please inform <@${config.botAuthorId}>.` })
                console.log(err)
            }
        }

        // INFO FOR SPECIFIED USER
        if(user) {
            const targetUser = await levels.fetch(user, interaction.guild.id, true)
            
            try {
                // IF USER INFO DNE
                if (!targetUser) {
                    // CREATING EMBED FOR RESPONSE        
                    let levelUserNotFoundEmbed = new discord.MessageEmbed()
                        .setColor(config.embedRed)
                        .setTitle(`${config.emjREDTICK} Sorry!`)
                        .setDescription(`I wasn't able to find this user's level information.`)
                        .setFooter(`If this is a bug, please submit a ModMail ticket to inform ${config.botAuthorUsername}.`)

                    // POST EMBED
                    return interaction.reply({ embeds: [levelUserNotFoundEmbed], ephemeral: true })
                }

                // FETCH GUILD MEMBER
                interaction.guild.members.fetch(user)
                    .then(member => {
                        // CREATING EMBED FOR RESPONSE        
                        let infoEmbed = new discord.MessageEmbed()
                            .setColor(config.embedGrey)
                            .setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic:true }))
                            .addField(`LEVEL:`, `${targetUser.level}`, true)
                            .addField(`TOTAL XP`, `${targetUser.xp}`, true)
                            .addField(`LEADERBOARD:`, `#${targetUser.position}`)
            
                        // POST EMBED
                        return interaction.reply({ embeds: [infoEmbed], ephemeral: true })
                })  
            } catch (err) {
                interaction.reply({ content: `I've encountered an error running this command. Please inform <@${config.botAuthorId}>.` })
                console.log(err);
            }
        }
    }
}