const discord = require('discord.js')
const { CommandInteraction } = require('discord.js')
const config = require ('../../config.json')
const moment = require('moment');

module.exports = {
    name: 'user_info',
    description: `(ADMIN) A command for generating information about a specific user in the server.`,
    options: [
        {
            name: `user`,
            description: `The user to generate information about.`,
            type: `USER`,
            required: true
        },
    ],
    permissions: 'ADMINISTRATOR',
    cooldown: 10,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        // GRABBING SLASH COMMAND INPUT VALUES
        const userId = inputs[0];

        // FETCH GUILD MEMBER
        interaction.guild.members.fetch(userId)
            .then(async user => {
                let member = client.users.cache.find(user => user.id === userId)
                
                const flags = await member.fetchFlags()
                var userFlags = flags.toArray()

                if(!userFlags) {
                    userFlags = `*(None)*`
                }
                if(userFlags) {
                    userFlags = `\`\`${userFlags.join(`\n`)}\`\``
                }

                // GRABBING NICKNAME IF SET
                var nickname = member.displayName
                if(member.displayName == member.username) {
                    nickname = `*(None)*`;
                }

                var booster = member.premiumSince
                if(!booster) {
                    booster =  `*(N/A)*`
                }

                const userRoles = user.roles.cache
                    .map(role => role.toString())
                    .slice(0, -1)


                let userInfoEmbed = new discord.MessageEmbed()
                    .setColor(config.embedDarkGrey)
                    .setAuthor(`${member.tag} Information`, `${member.displayAvatarURL()}`)
                    .addField(`Username:`, `${member.username}`, true)
                    .addField(`ID:`, `${member.id}`, true)
                    .addField(`Nickname:`, `${nickname}`, true)
                    .addField(`Server Boosting:`, `${booster}`, true)
                    .addField(`Server Join Date:`, `${moment(user.joinedAt).format(`LLL`)}`, true)
                    .addField(`Discord Join Date:`, `${moment(member.createdTimestamp).format(`LL`)}`, true)
                    .addField(`Server Roles:`, `${userRoles.join('\n')}`, true)
                    .addField(`Flags:`, `${userFlags}`, true)
                    .addField(`Bot?`, `${member.bot}`, true)

                return interaction.reply({ embeds: [userInfoEmbed], ephemeral: true });
            })
    }
}
