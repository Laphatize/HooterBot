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
            .then(async member => {
                let member = client.users.cache.find(member => member.id === memberId)
                
                const flags = await member.fetchFlags()
                var memberFlags = flags.toArray()

                if(!memberFlags) {
                    memberFlags = `*(None)*`
                }
                if(memberFlags) {
                    memberFlags = `\`\`${userFlags.join(`\n`)}\`\``
                }

                // GRABBING NICKNAME IF SET
                var nickname = member.displayName
                if(member.displayName == member.username) {
                    nickname = `*(None)*`;
                }

                var booster = user.premiumSince
                if(!booster) {
                    booster =  `*(N/A)*`
                }

                const memberRoles = member.roles.cache
                    .map(role => role.toString())
                    .slice(0, -1)


                let userInfoEmbed = new discord.MessageEmbed()
                    .setColor(config.embedDarkGrey)
                    .setAuthor(`${user.tag}'s Information`, `${user.displayAvatarURL()}`)
                    .addField(`Username:`, `${user.username}`, true)
                    .addField(`ID:`, `${user.id}`, true)
                    .addField(`Nickname:`, `${nickname}`, true)
                    .addField(`Server Boosting:`, `${booster}`, true)
                    .addField(`Server Join Date:`, `${moment(member.joinedAt).format(`LLL`)}`, true)
                    .addField(`Discord Join Date:`, `${moment(user.createdTimestamp).format(`LL`)}`, true)
                    .addField(`Server Roles:`, `${memberRoles.join('\n')}`, true)
                    .addField(`Flags:`, `${memberFlags}`, true)
                    .addField(`Bot?`, `${user.bot}`, true)

                return interaction.reply({ embeds: [userInfoEmbed], ephemeral: true });
            })
    }
}
