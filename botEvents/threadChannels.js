const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadCreate',
	async execute(thread, client) {

        // THREAD CHANNEL ARRAY
        if(
         // SCHOOL & COLLEGE CHANNELS:
            thread.parent.id === '829709899377410120' // ART-AND-ARCHITECTURE
         || thread.parent.id === '905082995893993472' // FOX-BUSINESS
         || thread.parent.id === '829710131801227284' // DENTISTRY
         || thread.parent.id === '905082819091525673' // EDUCATION-AND-HUMAN-DEVELOPMENT
         || thread.parent.id === '905082371886415912' // ENGINEERING
         || thread.parent.id === '829710377951559700' // LAW
         || thread.parent.id === '905082007615324252' // LIBERAL-ARTS
         || thread.parent.id === '905081827436421160' // MEDIA-AND-COMMS
         || thread.parent.id === '829710783058935882' // MEDICINE
         || thread.parent.id === '905081404013023262' // MUSIC-AND-DANCE
         || thread.parent.id === '829710975308791858' // PHARMACY
         || thread.parent.id === '829711074600157244' // PODIATRIC-MEDICINE
         || thread.parent.id === '829711135829786644' // PUBLIC HEALTH
         || thread.parent.id === '829711245380157440' // SCHOOL OF SOCIAL WORK
         || thread.parent.id === '829711350166323281' // SPORT-TOURISM-HOSPITALITY-MANAGEMENT
         || thread.parent.id === '905080106333110312' // SCIENCE-AND-TECHNOLOGY
         || thread.parent.id === '829711412884406312' // THEATER-FILM-MEDIA-ARTS
        
         // OTHER THREAD CHANNELS
         || thread.parent.id === '897290329617739776' // HOUSING
        ){
            // DELETING PAST HOOTERBOT MESSAGES IN THE CHANNEL
            // FETCHING, FILTERING, BULK-DELETING
            let m = await thread.parent.messages.fetch()
            thread.parent.bulkDelete(m.filter(msgs => msgs.author.id === config.botId, true))

            // POST THREAD INSTRUCTIONS
            let threadChannelEmbed = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .setTitle(`This channel is using ${config.emjThread} threads to organize conversations!`)
                .addField(`Want to participate in a discussion?`, `Select a thread above and start talking! You can reopen archived threads at any time by sending a new message.`)
                .addField(`Want to follow a discussion?`, `Select a thread and click the "Join" button. You'll join the thread and get notifications for any new messages.`)
                .addField(`Want to talk about a new topic?`, `Create a new thread using the ${config.emjAttachment} button. Make sure your thread title is descriptive so others know what your thread is about.`)
                .setFooter(`Threads may be renamed or closed by the admins or mods per the <#829409161581821994>.`)

            return thread.parent.send({ embeds: [threadChannelEmbed ]})
        }
	},
};