const discord = require('discord.js')
const fs = require(`fs`)
const config = require ('../../config.json')


module.exports = {
    name: `help`,
    aliases: [`commands`],
    description: `Describes ${config.botName}'s commands. (🗺️📌 *You are here*)`,
    category: `Help and Info`,
    expectedArgs: '',
    cooldown: 60,
    minArgs: 0,
    maxArgs: 0,
    guildUse: true,
    dmUse: true,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        const VerifCmds = require(`../Verification Tickets`)

        let helptext = `Here is a list of my commands you can use:\n\n`;

        // ADMIN COMMANDS
        let AdminCmds = fs.readdirSync(`../Admin-Only`)
        console.log(`AdminCmds = ${AdminCmds}`)

        // FUN COMMANDS
        let FunCmds = fs.readdirSync(`../Fun`)
        console.log(`FunCmds = ${FunCmds}`)

        // HELP & INFO COMMANDS
        let HelpCmds = fs.readdirSync(`../Help and Info`)
        console.log(`HelpCmds = ${HelpCmds}`)

        // MISCELLANEOUS COMMANDS
        let MiscCmds = fs.readdirSync(`../Miscellaneous`)
        console.log(`MiscCmds = ${MiscCmds}`)

        // VERIFICATION COMMANDS
        let VerifCmds = fs.readdirSync(`../Verification Tickets`)
        console.log(`VerifCmds = ${VerifCmds}`)


        // // CREATING EMBED FOR RESPONSE        
        // let helpEmbed = new discord.MessageEmbed()
        // .setColor(config.embedBlurple)
        // .setTitle(`**Help:**`)
        // .setDescription(`${helptext}`)
        // .setFooter(`(Crown = Need administrator permissions.)`)
        
        // // RESPONDING TO USER WITH COMMAND LIST
        // message.channel.send({ embeds: [helpEmbed] })
    }
}