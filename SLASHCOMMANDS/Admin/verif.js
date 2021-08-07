module.exports = {
    name: 'verification',
    description: `A collection of commands regarding users.`,
    options: [        
        {
            name: 'blacklist',
            type: 'SUB_COMMAND',
            description: `ADMIN | Blacklist a user from the verification system. [10s]`,
        },{
            name: 'category',
            type: 'SUB_COMMAND',
            description: `ADMIN | Set ticket channel creation category. Cannot modify category once set. [10s]`,
        },{
            name: 'maintenance',
            type: 'SUB_COMMAND',
            description: `ADMIN | Toggle verification prompt to enter/exit maintenance mode. [10s]`,
        },{
            name: 'perksembed',
            type: 'SUB_COMMAND',
            description: `ADMIN | Generate/update the verification perks embed message. [60s]`,
        },{
            name: 'promptembed',
            type: 'SUB_COMMAND',
            description: `ADMIN | Generate/update the verification prompt containing the buttons. [60s]`,
        }
    ],
}