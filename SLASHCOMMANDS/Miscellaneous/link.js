const config = require ('../../config.json')

// COMMAND ID: 871240034152501266

module.exports = {
    name: 'link',
    description: `Generates a link to a Temple University resource.`,
    permissions: '',
    cooldown: 0,
    defaultPermission: true,
    options: [
        {
            name: `title`,
            description: `Name of the link to generate.`,
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: `Academic_Plan`,
                    value: `academic_plan`,
                },{
                    name: `Admissions`,
                    value: `admissions`,
                },{
                    name: `Athletics`,
                    value: `athletics`,
                },{
                    name: `Canvas`,
                    value: `canvas`,
                },{
                    name: `Clubs_&_Orgs`,
                    value: `clubs_orgs`,
                },{
                    name: `Course_Catalog`,
                    value: `course_catalog`,
                },{ 
                    name: `DARS`,
                    value: `dars`,
                },{
                    name: `Dining`,
                    value: `dining`,
                },{
                    name: `Discord_Server`,
                    value: `discord`,
                },{
                    name: `Finals`,
                    value: `finals`,
                },{
                    name: `Financial_Aid`,
                    value: `financial_aid`,
                },{
                    name: `Housing`,
                    value: `housing`,
                },{
                    name: `Sports`,
                    value: `sports`,
                },{
                    name: `Sports_Tickets`,
                    value: `sports_tickets`,
                },{
                    name: `Student_Financial_Services`,
                    value: `sfs`,
                },{
                    name: `TUid`,
                    value: `tuid`,
                },{
                    name: `TUportal`,
                    value: `tuportal`,
                }
            ]
        }
    ],
    defaultPermission: true,
    run: async(client, interaction, inputs) => {

        var linkName;
        var link;

        // FETCHING NAME AND LINK
        switch(inputs[0]) {
            // ACADEMIC PLANS
            case 'academic_plan':
                linkName = `Academic Plans and Suggested Timelines`;
                link = `https://bulletin.temple.edu/undergraduate/schools-colleges/`;
                break;

            case 'admissions':
                linkName = `Admissions`;
                link = `https://www.temple.edu/admissions`;
                break;
    
            case 'athletics':
            case 'sports':
            case 'sports_tickets':
                linkName = `Athleteics & Tickets`
                link = `https://owlsports.com/`
                break;
      
            case 'canvas':
                linkName = `Canvas`
                link = `https://templeu.instructure.com/`
                break;

            case 'clubs_orgs':
                linkName = `Clubs & Organizations`
                link = `https://temple.campuslabs.com/engage/`
                break;

            case 'course_catalog':
                linkName = `Course Catalog`
                link = `https://prd-xereg.temple.edu/StudentRegistrationSsb/ssb/term/termSelection?mode=courseSearch`
                break;

            case 'dars':
                linkName = `DARS (Degree Audit Reporting System)`
                link = `https://dars.temple.edu/`
                break;

            case 'dining':
                linkName = `Dining`
                link = `https://temple.campusdish.com/`
                break;

            case 'discord':
                linkName = `Use this link to join the Temple University Discord`
                link = `https://discord.com/invite/vbtaBXt8dd`
                break;

            case 'finals':
                linkName = `Final Exam Schedules`
                link = `http://www.temple.edu/registrar/students/courseinfo/exams.asp`
                break;

            case 'financial_aid':
            case 'sfs':
                linkName = `Student Financial Services`
                link = `https://sfs.temple.edu/about/appointments`
                break;
    
            case 'housing':
                linkName = `Housing`
                link = `https://housing.temple.edu/`
                break;

            case 'tuid':
                linkName = `Get Your TUid`
                link = `https://tuportal5.temple.edu/html/TEMPLE/apps/tup/TempleGCF/index.jsp?gcf=tu_getmytuid`
                break;

            case 'tuportal':
                linkName = `TUPortal`
                link = `https://tuportal5.temple.edu/`
                break;
        }


        // POSTING LINK USING VALUES FROM ABOVE
        interaction.reply({ content: `**${linkName}**: <${link}>` })
    }
}