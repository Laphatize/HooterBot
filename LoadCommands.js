const path = require('path')
const fs = require('fs')

module.exports = (client) => {

    const commands = []

    // READING COMMANDS
    const readCommands = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else {
                const option = require(path.join(__dirname, dir, file))

                commands.push(option)
            }
        }
    }

  // REGISTERING COMMANDS
  readCommands('COMMANDS')

  return commands
}