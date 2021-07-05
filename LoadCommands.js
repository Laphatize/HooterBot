const path = require('path')
const fs = require('fs')

module.exports = (client) => {
    // IMPORTING COMMAND-BASE FROM COMMANDS FOLDER
    const baseFile = 'command-base.js'
    const commandBase = require(`./COMMANDS/${baseFile}`)

    const commands = []

    // READING COMMANDS
    const readCommands = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else if (file !== baseFile) {
                const option = require(path.join(__dirname, dir, file))

                commands.push(option)
                // IF "client" IS PASSED
                if(client) {
                    commandBase(client, option)
                }
            }
        }
    }

  // REGISTERING COMMANDS
  readCommands('COMMANDS')

  return commands
}