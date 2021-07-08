const discord = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name: `link`,
    aliases: [`usefullink`],
    description: `Generates a link to a Temple resource.`,
    expectedArgs: '<site_name>',
    cooldown: 5,
    minArgs: 1,
    maxArgs: 1,
    guildUse: true,
    dmUse: false,
    permissions: '',
    requiredRoles: [],
    execute: async (message, arguments, prefix, client) => {

        let linkName = arguments[0].toLowerCase();
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

        // COURSES
        if(linkName === `courses`){
            linkName = `Course Catalog`
            link = `https://prd-xereg.temple.edu/StudentRegistrationSsb/ssb/term/termSelection?mode=courseSearch`
        }

        // ACADEMIC PLANS
        if(linkName === `academicplan`){
            linkName = `Academic Plans and Suggested Timelines`
            link = `https://bulletin.temple.edu/undergraduate/schools-colleges/`
        }

        // FINALS
        if(linkName === `finals`){
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
        if(linkName === `athletics` || linkName === `tickets`){
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


        // POSTING LINK
        await message.reply({content: `${linkName}: <${link}>`})
        .catch(err => console.log(err))
        return;
    }
}