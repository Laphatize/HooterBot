const discord = require('discord.js')
const config = require ('../../config.json')
const levels = require('discord-xp');

module.exports = {
    name: 'level',
    description: `Get your XP level (no user specified), or for a specific user. [CD: 10s]`,
    options: [
        {
            name: `user`,
            description: `Find this user's XP and level.`,
            type: `USER`,
            required: false
        }
    ],
    permissions: '',
    cooldown: 10,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // GRABBING SLASH COMMAND INPUT VALUES
        const user = inputs[0];


        // INFO FOR USER ISSUING COMMAND
        if(!user) {

            const selfUser = await levels.fetch(interaction.user.id, interaction.guild.id)
            
            console.log(`selfUser successfully fetched`)

            try {
                console.log(`selfUser value not found`)
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
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .addField(`LEVEL:`, `${selfUser.level}`)
                    .addField(`TOTAL XP`, `${selfUser.xp}`)
    
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
            console.log(`User value detected in command`)
            const targetUser = await levels.fetch(user, interaction.guild.id)
            
            try {
                console.log(`User value not found`)
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
                .then(user => {
                    // CREATING EMBED FOR RESPONSE        
                    let infoEmbed = new discord.MessageEmbed()
                        .setColor(config.embedGrey)
                        .setAuthor(user.username, interaction.user.displayAvatarURL())
                        .addField(`LEVEL:`, `${targetUser.level}`)
                        .addField(`TOTAL XP`, `${targetUser.xp}`)
        
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