const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'threadCreate',
	async execute(thread, client) {

        // DELETING PAST HOOTERBOT MESSAGES IN THE CHANNEL
        // FETCHING, FILTERING, BULK-DELETING
        let msgs = thread.parent.messages.fetch()
        let msgfilter = msgs.filter(m => m.author.id === config.botId)
        thread.parent.bulkDelete(msgfilter)


        // THREAD CHANNEL ARRAY
        if(
            thread.parent.id === 829706960403955724 // PROSPECTIVE STUDENTS
        ){
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