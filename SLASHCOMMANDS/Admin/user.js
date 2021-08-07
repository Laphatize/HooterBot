module.exports = {
    name: 'user',
    description: `A collection of commands regarding users.`,
    options: [        
        {
            name: 'birthday',
            type: 'SUB_COMMAND',
            description: `ADMIN | A command for admins to migrate MEE6's birthdays over to HooterBot.`,
        },{
            name: 'levelimport',
            type: 'SUB_COMMAND',
            description: `ADMIN | Import MEE6 Leaderboard values for up to 10 users at a time.`,
        },{
            name: 'levelimport',
            type: 'SUB_COMMAND',
            description: `MODERATOR | A command for generating information about a specific user in the server.`,
        }
    ],
}