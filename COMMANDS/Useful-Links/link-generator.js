const discord = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name: `link`,
    aliases: [`usefullink`],
    description: `Generates a link to a Temple resource.`,
    expectedArgs: '<site_name>',
    cooldown: 5,
    minArgs: 1,
    maxArgs: 1,
    guildUse: true,
    dmUse: false,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, prefix, client) => {

        let linkName = arguments[0].toLowerCase();
        let link;

        // TU PORTAL
        if(linkName === `tuportal`){
            linkName = `TUPortal`
            link = `https://tuportal5.temple.edu/`
        }

        // DARS
        if(linkName === `dars`){
            linkName = `DARS (Degree Audit Reporting System)`
            link = `https://dars.temple.edu/`
        }

        // CANVAS
        if(linkName === `canvas`){
            linkName = `Canvas`
            link = `https://templeu.instructure.com/`
        }


        // POSTING LINK
        await message.author.send({content: `${linkName}: <${link}>`})
        .catch(err => console.log(err))
        return;
    }
}