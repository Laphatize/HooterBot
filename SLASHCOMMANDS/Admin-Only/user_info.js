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
            .then(user => {
                let member = client.users.cache.find(user => user.id === userId)
                client.users.fetch(userId)
                    .then( user => {
                        let flagsArray = user.fetchFlags.toArray()
                        console.log(`flagsArray = ${flagsArray}`)
                    })

                var nickname = member.username
                if(!member.username) {
                    nickname = `*(None)`;
                }

                var booster = member.premiumSince
                if(!booster) {
                    booster =  `*(N/A)*`
                }

                const userRoles = user.roles.cache
                    .map(role => role.toString())
                    .slice(0, -1)

                // const flags = user.flags;
                // const flagsArray = flags.toArray()
                // console.log(`flags = ${flags}`)
                // console.log(`flagsArray = ${flagsArray}`)

                let userInfoEmbed = new discord.MessageEmbed()
                    .setColor(config.embedDarkGrey)
                    .setAuthor(`${member.tag} Information`, `${member.displayAvatarURL()}`)
                    .addField(`Username:`, `${member.username}`, true)
                    .addField(`ID:`, `${member.id}`, true)
                    .addField(`Nickname:`, `${nickname}`, true)
                    .addField(`Bot?`, `${member.bot}`, true)
                    .addField(`Server Boosting:`, `${member.premiumSince}`, true)
                    .addField(`\u200B`,`\u200B`, true)      // BLANK FIELD, NOT USED
                    .addField(`Server Join Date:`, `${moment(member.joinedAt).format(`LL LTS`)}`, true)
                    .addField(`Discord Join Date:`, `${moment(user.createdTimestamp).format(`LL`)}`, true)
                    .addField(`Server Roles:`, `${userRoles.join('\n')}`)
                    // .addField(`Flags:`, `${flagsArray.length ? flagsArray.map(flag => flags[flag]).join(', ') : 'None'}`)

                return interaction.reply({ embeds: [userInfoEmbed], ephemeral: true });
            })
    }
}
