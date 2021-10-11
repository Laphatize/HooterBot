const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {

        if (message.content.includes('threadChannelTestEmbed')) {
            
            setTimeout(() => message.delete(), 0 );
            
            let testEmbed = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .setTitle(`This channel is using ${config.emjThread} threads!`)
                .addField(`Want to participate in a discussion?`, `Select a thread above and start talking! You can reopen archived threads at any time.`)
                .addField(`Want to follow a discussion?`, `Select a thread and click the "Join" button. You'll join the thread and get notifications for any new messages.`)
                .addField(`Want to talk about a new topic?`, `Create a new thread using the ${config.emjAttachment} button. Make sure your thread title is descriptive so others know what your thread is about.`)
                .setFooter(`Threads may be renamed or closed by the admins or mods per the rules [which we'll have to add].`)

            return message.channel.send({ embeds: [testEmbed ] })
        }
    }
}


module.exports = {
	name: 'threadCreate',
	async execute(thread, client) {

        thread.parent.send({ content: "A new thread was created with this channel as the parent, right?" })
	},
};