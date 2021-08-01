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

                let userInfoEmbed = new discord.MessageEmbed()
                    .setColor(config.embedDarkGrey)
                    .setAuthor(`${member.tag} Information`, `${member.displayAvatarURL()}`)
                    .addField(`Username:`, `${member.username}`, true)
                    .addField(`ID:`, `${member.id}`, true)
                    .addField(`Nickname:`, `${member.nickname}` || `*(None)*`, true)
                    .addField(`Bot?`, `${member.bot}`, true)
                    .addField(`Server Boosting:`, `${member.premiumSince}` || `*(N/A)*`, true)
                    .addField(`\u200B`,`\u200B`, true)      // BLANK FIELD FOR SPACING
                    .addField(`Server Join Date:`, `${moment(Date(member.joinedTimestamp)).format("MMMM DD YYYY, h:mm:ss a")} (UTC)`)
                    .addField(`Discord Join Date:`, `${moment(Date(user.createdTimestamp)).format("MMMM DD YYYY, h:mm:ss a")} (UTC)`)
                    .addField(`Server Roles:`, `*(still working on this part)*`)

                return interaction.reply({ embeds: [userInfoEmbed], ephemeral: true });
            })
    }
}
