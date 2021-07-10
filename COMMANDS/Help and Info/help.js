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

        let helptext = `Here is a list of my commands you can use:\n\n**Sorry, this command is not working right now and is being reworked.**`;

        // ADMIN COMMANDS
        // console.log(`AdminCmds:`)
        // let AdminCmds = fs.readdirSync(AdminOnlyCmdsFolder).forEach(file => {
        //     console.log(file)
        // })


        // // FUN COMMANDS
        // console.log(`FunCmds:`)
        // let FunCmds = fs.readdirSync(FunCmdsFolder).forEach(file => {
        //     console.log(file)
        // })


        // // HELP & INFO COMMANDS
        // console.log(`HelpCmds:`)
        // let HelpCmds = fs.readdirSync(HelpInfoCmdsFolder).forEach(file => {
        //     console.log(file)
        // })


        // // MISCELLANEOUS COMMANDS
        // console.log(`MiscCmds:`)
        // let MiscCmds = fs.readdirSync(MiscCmdsFolder).forEach(file => {
        //     console.log(file)
        // })


        // // VERIFICATION COMMANDS
        // console.log(`VerifCmds:`)
        // let VerifCmds = fs.readdirSync(VerifCmdsFolder).forEach(file => {
        //     console.log(file)
        // })


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