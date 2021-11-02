const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadCreate',
	async execute(thread, client) {

        // THREAD CHANNEL ARRAY
        if(
            thread.parent.id === '829706960403955724' // PROSPECTIVE STUDENTS
         || thread.parent.id === '897290329617739776' // UNIVERSITY HOUSING




         || thread.parent.id === '829711412884406312' // THEATER-FILM-MEDIA-ARTS

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