const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const config = require('../config.json');


const commands = [];

for (const folder of fs.readdirSync(`../SLASHCOMMANDS/`)) {
    const commandFiles = fs.readdirSync(`../SLASHCOMMANDS/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../SLASHCOMMANDS/${folder}/${file}`);
        
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '9' }).setToken(process.env.HB_BOT_TOKEN);

rest.put(Routes.applicationCommands(config.botId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(error => {
        console.log(`\n\nSLASH COMMAND DEPLOYMENT ERROR\n ${error}`);
    });