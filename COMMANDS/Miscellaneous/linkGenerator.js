const discord = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name: `link`,
    aliases: [`usefullink`],
    description: `Generates a link to a Temple resource.`,
    category: `Miscellaneous`,
    expectedArgs: '<title or site name> (use "all" to generate available list)',
    cooldown: 5,
    minArgs: 0,
    maxArgs: 5,
    guildUse: true,
    dmUse: false,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, client) => {

        if(!arguments) {
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


        if(arguments[0]) {
            let linkName = arguments.join("").toLowerCase();
            let link;

            // TU PORTAL
            if(linkName === `tuportal`){
                linkName = `TUPortal`
                link = `https://tuportal5.temple.edu/`
            }

            // DARS
            if(linkName === `dars`){
                linkName = `DARS (Degree Audit Reporting System)`
                link = `https://dars.temple.edu/`
            }

            // CANVAS
            if(linkName === `canvas`){
                linkName = `Canvas`
                link = `https://templeu.instructure.com/`
            }

            // TUid
            if(linkName === `tuid` || linkName === `idcard`){
                linkName = `Canvas`
                link = `https://tuportal5.temple.edu/html/TEMPLE/apps/tup/TempleGCF/index.jsp?gcf=tu_getmytuid`
            }

            // COURSES
            if(linkName === `courses`){
                linkName = `Course Catalog`
                link = `https://prd-xereg.temple.edu/StudentRegistrationSsb/ssb/term/termSelection?mode=courseSearch`
            }

            // ACADEMIC PLANS
            if(linkName === `academicplan` || linkName === `academicplans` || linkName === `academictimeline`){
                linkName = `Academic Plans and Suggested Timelines`
                link = `https://bulletin.temple.edu/undergraduate/schools-colleges/`
            }

            // FINALS
            if(linkName === `finals` || linkName === `finalschedule` || linkName === `finalsschedule`){
                linkName = `Final Exam Schedules`
                link = `http://www.temple.edu/registrar/students/courseinfo/exams.asp`
            }

            // ADMISSIONS
            if(linkName === `admissions`){
                linkName = `Admissions`
                link = `https://www.temple.edu/admissions`
            }

            // FINANCIAL AID
            if(linkName === `financialaid` || linkName === `sfs`){
                linkName = `Student Financial Services`
                link = `https://sfs.temple.edu/about/appointments`
            }

            // CLUBS AND ORGS
            if(linkName === `clubs` || linkName === `orgs`|| linkName === `organizations`){
                linkName = `Clubs & Organizations`
                link = `https://temple.campuslabs.com/engage/`
            }

            // ATHLETICS
            if(linkName === `athletics` || linkName === `sports` || linkName === `tickets`){
                linkName = `Athleteics & Tickets`
                link = `https://owlsports.com/`
            }

            // DINING
            if(linkName === `dining`){
                linkName = `Dining`
                link = `https://temple.campusdish.com/`
            }

            // HOUSING
            if(linkName === `housing`){
                linkName = `Housing`
                link = `https://housing.temple.edu/`
            }
            
            // POSTING LINK USING VALUES FROM ABOVE
            await message.reply({content: `${linkName}: <${link}>`})
                .catch(err => console.log(err))
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
    }
}