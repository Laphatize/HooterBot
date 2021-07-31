const discord = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name: `link`,
    aliases: [`links`, `usefullink`, `usefullinks`],
    description: `Generates a link to a Temple resource.`,
    category: `Miscellaneous`,
    expectedArgs: '<title or site name> (use "all" to generate available list)',
    cooldown: 5,
    minArgs: 0,
    maxArgs: 5,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        if(!arguments[0]) {
            let linkListEmbed = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .setTitle(`Here is a list of links I know!`)
                .setDescription(`\`TUportal\`
                \`DARS\`
                \`Canvas\`
                \`TUid\` or \`ID card\`
                \`Courses\`
                \`academic plan\` or \`academic timeline\`
                \`finals\` or \`final schedule\` or \`finals schedule\`
                \`admissions\`
                \`financialaid\` or \`sfs\`
                \`clubs\` or \`orgs\` or \`organizations\`
                \`athletics\` or \`sports\` or \`tickets\`
                \`dining\`
                \`housing\``)
                .setFooter(`Don't worry - I'm not particular about capitalization or spaces between words :)`)
    
            // SENDING TO CHANNEL
            return message.channel.send({embeds: [linkListEmbed]})
                .catch(err => console.log(err))
        }
    
        let linkName = arguments.join("").toLowerCase();
        let link;

        // TU PORTAL
        if(linkName == `tuportal`){
            linkName = `TUPortal`
            link = `https://tuportal5.temple.edu/`
        }

        // DARS
        else if(linkName == `dars`){
            linkName = `DARS (Degree Audit Reporting System)`
            link = `https://dars.temple.edu/`
        }

        // CANVAS
        else if(linkName == `canvas`){
            linkName = `Canvas`
            link = `https://templeu.instructure.com/`
        }

        // TUid
        else if(linkName == `tuid` || linkName == `idcard`){
            linkName = `Get Your TUid`
            link = `https://tuportal5.temple.edu/html/TEMPLE/apps/tup/TempleGCF/index.jsp?gcf=tu_getmytuid`
        }

        // COURSES
        else if(linkName == `courses`){
            linkName = `Course Catalog`
            link = `https://prd-xereg.temple.edu/StudentRegistrationSsb/ssb/term/termSelection?mode=courseSearch`
        }

        // ACADEMIC PLANS
        else if(linkName == `academicplan` || linkName == `academicplans` || linkName == `academictimeline`){
            linkName = `Academic Plans and Suggested Timelines`
            link = `https://bulletin.temple.edu/undergraduate/schools-colleges/`
        }

        // FINALS
        else if(linkName == `finals` || linkName == `finalschedule` || linkName == `finalsschedule`){
            linkName = `Final Exam Schedules`
            link = `http://www.temple.edu/registrar/students/courseinfo/exams.asp`
        }

        // ADMISSIONS
        else if(linkName == `admissions`){
            linkName = `Admissions`
            link = `https://www.temple.edu/admissions`
        }

        // FINANCIAL AID
        else if(linkName == `financialaid` || linkName == `sfs`){
            linkName = `Student Financial Services`
            link = `https://sfs.temple.edu/about/appointments`
        }

        // CLUBS AND ORGS
        else if(linkName == `clubs` || linkName == `orgs`|| linkName == `organizations`){
            linkName = `Clubs & Organizations`
            link = `https://temple.campuslabs.com/engage/`
        }

        // ATHLETICS
        else if(linkName == `athletics` || linkName == `sports` || linkName == `tickets`){
            linkName = `Athleteics & Tickets`
            link = `https://owlsports.com/`
        }

        // DINING
        else if(linkName == `dining`){
            linkName = `Dining`
            link = `https://temple.campusdish.com/`
        }

        // HOUSING
        else if(linkName == `housing`){
            linkName = `Housing`
            link = `https://housing.temple.edu/`
        }

        else {
            let linkOptionsEmbed = new discord.MessageEmbed()
                .setColor(config.embedBlurple)
                .setTitle(`Sorry, I don't know that link yet!`)
                .setDescription(`Here's a list of all the links I can generate for you:\n
                \`TUportal\`
                \`DARS\`
                \`Canvas\`
                \`TUid\` or \`ID card\`
                \`Courses\`
                \`academic plan\` or \`academic timeline\`
                \`finals\` or \`final schedule\` or \`finals schedule\`
                \`admissions\`
                \`financialaid\` or \`sfs\`
                \`clubs\` or \`orgs\` or \`organizations\`
                \`athletics\` or \`sports\` or \`tickets\`
                \`dining\`
                \`housing\``)
                .setFooter(`Don't worry - I'm not particular about capitalization or spaces between words :)`)

            // SENDING TO CHANNEL
            return message.channel.send({embeds: [linkOptionsEmbed]})
                .catch(err => console.log(err))
        }
      
        // POSTING LINK USING VALUES FROM ABOVE
        await message.reply({content: `${linkName}: <${link}>`})
        .catch(err => console.log(err))
    }
}