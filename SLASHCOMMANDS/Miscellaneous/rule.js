const discord = require('discord.js')
const config = require ('../../config.json')


module.exports = {
    name: 'rule',
    description: 'Generates and individual rule.',
    options: [
        {
            name: `number`,
            description: `The rule to display.`,
            type: `INTEGER`,
            required: true,
            choices: [
                {
                    name: `1_Communicate_in_English`,
                    value: 1,
                },{
                    name: `2_Be_respectful_of_all_members`,
                    value: 2,
                },{
                    name: `3_No_spam`,
                    value: 3,
                },{
                    name: `4_Channels_on-topic`,
                    value: 4,
                },{
                    name: `5_No_NSFW`,
                    value: 5,
                },{
                    name: `6_No_advertising`,
                    value: 6,
                },{
                    name: `7_Server_raiding`,
                    value: 7,
                },{
                    name: `8_Discord_TOS`,
                    value: 8,
                },{
                    name: `9_Decisions_final`,
                    value: 9,
                },{
                    name: `10_punishments`,
                    value: 10,
                }
            ]
        },
    ],
    permissions: '',
    dmUse: false,
    cooldown: 0,
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        let ruleNum = inputs[0]

        // MAIN RULES EMBED
        let rulesArray = [
            [`Communicate in English`, `All communication within the server needs to be in English.`],
            [`Be respectful of all members`,`We have zero tolerance for discriminatory rhetoric, racism, sexism, homophobia, transphobia, or any other kind of offensive language. The use of inappropriate language and profanity should be kept to a minimum. Derogatory language and slurs are prohibited. This includes usernames, nicknames, and statuses.`],
            [`No spam, mention spamming, or ghost pinging`, `This includes excessive use of text, emojis, GIFs, and reactions. Ghost pinging is tagging a user then deleting the message for the sake of pinging and frustrating users.`],
            [`Keep channels on-topic`, `If discussion is not relevant to the channel, consider taking it to <#829409161581821997> or <#829409161581822000>>. If discussion digresses from the channel topic, consider opening a thread to continue your conversation. All memes must go in <#829409161581821999>. Mods reserve the right to delete messages that do not fit the channel subject.`],
            [`No NSFW material or discussions that may cause hostility`, `Explicit content/porn is not allowed ANYWHERE in the server. Discussions about politics, religion or anything that may cause hostility are prohibited.`],
            [`No advertising`, `This includes ads for other communities, streams, or goods. Verified users may post student opportunities in <#829732282079903775>, though these are still subject to moderator discretion. DM advertising is strictly prohibited and will result in an immediate ban.`],
            [`No server raiding`, `Discussion of raids or participating in raids is not allowed.`],
            [`Abide by Discord's Community Guidelines and Terms of Service (ToS) as well as Temple University's Student Code of Conduct`, `• [Community Guidelines](https://discord.com/guidelines)\n > • [Terms of Service](https://discord.com/terms)\n > • [Student Conduct Code](https://secretary.temple.edu/sites/secretary/files/policies/03.70.12.pdf)`],
            [`Moderator and Admin decisions are final`, `Decisions are made at the moderation team's discretion based on evidence and context of a situation.`],
            [`Multiple warnings will result in mutes and eventual bans`, `The admins and moderators reserve discretion in expediting this process based on the severity of a situation.`],
        ]

        let ruleTitle = rulesArray[ruleNum-1][0]
        let ruleText = rulesArray[ruleNum-1][1]
        

        // DEFINING LOG EMBED
        let rulesEmbed = new discord.MessageEmbed()
            .setColor(config.embedBlurple)
            .setTitle(`Rule ${ruleNum}: ${ruleTitle}`)
            .setDescription(`${ruleText}\n\n*See the full list of rules at* ${interaction.guild.channels.cache.find(ch => ch.name === `rules`)}*.*`)
            

        // LOG ENTRY
        return interaction.reply({ embeds: [rulesEmbed] })
            .catch(err => console.log(err))
    }
}