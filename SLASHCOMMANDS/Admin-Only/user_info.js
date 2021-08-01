const discord = require('discord.js')
const { CommandInteraction } = require('discord.js')
const config = require ('../../config.json')

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
            .then(user => {
                let member = client.users.cache.find(user => user.id === userId)

                var nickname = member.username
                if(!member.username) {
                    nickname = `*(None)`;
                }

                var booster = member.premiumSince
                if(!booster) {
                    booster =  `*(N/A)*`
                }

                const userRoles = user.roles.cache
                    .sort((a, b) => b.position - a.position)
                    .map(role => role.toString())
                    .slice(0, -1)

                const userFlags = user.flags.toArray();

                let userInfoEmbed = new discord.MessageEmbed()
                    .setColor(config.embedDarkGrey)
                    .setAuthor(`${member.tag} Information`, `${member.displayAvatarURL()}`)
                    .addField(`Username:`, `${member.username}`, true)
                    .addField(`ID:`, `${member.id}`, true)
                    .addField(`Nickname:`, `${nickname}`, true)
                    .addField(`Bot?`, `${member.bot}`, true)
                    .addField(`Server Boosting:`, `${member.premiumSince}`, true)
                    .addField(`\u200B`,`\u200B`, true)      // BLANK FIELD, NOT USED
                    .addField(`Server Join Date:`, `${moment(member.joinedAt).format(`LL LTS`)}`)
                    .addField(`Discord Join Date:`, `${moment(user.createdTimestamp).format(`LL`)}`)
                    .addField(`Server Roles:`, `${userRoles.join('\n')}`)
                    .addField(`Flags:`, `${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`)

                return interaction.reply({ embeds: [userInfoEmbed], ephemeral: true });
            })
    }
}
