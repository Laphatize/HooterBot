const config = require ('../../config.json')
const { MessageActionRow, MessageButton } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription(`Generates a link to a Temple University resource. (Optional school specifier)`)
}


//     name: 'link',
//     description: `Generates a link to a Temple University resource. (Optional school specifier)`,
//     permissions: '',
//     dmUse: true,
//     cooldown: 0,
//     options: [
//         {
//             name: `title`,
//             description: `Name of the link to generate.`,
//             type: 'STRING',
//             required: true,
//             choices: [
//                 {
//                     name: `Academic_Plan`,
//                     value: `academic_plan`,
//                 },{
//                     name: `Admissions`,
//                     value: `admissions`,
//                 },{
//                     name: `Advising`,
//                     value: `advising`,
//                 },{
//                     name: `Athletics`,
//                     value: `athletics`,
//                 },{
//                     name: `Canvas`,
//                     value: `canvas`,
//                 },{
//                     name: `Clubs_&_Orgs`,
//                     value: `clubs_orgs`,
//                 },{
//                     name: `Course_Catalog`,
//                     value: `course_catalog`,
//                 },{
//                     name: `DARS`,
//                     value: `dars`,
//                 },{
//                     name: `Dining`,
//                     value: `dining`,
//                 },{
//                     name: `Discord_Server`,
//                     value: `discord`,
//                 },{
//                     name: `Finals`,
//                     value: `finals`,
//                 },{
//                     name: `Financial_Aid`,
//                     value: `financial_aid`,
//                 },{
//                     name: `Housing`,
//                     value: `housing`,
//                 },{
//                     name: `Sports`,
//                     value: `sports`,
//                 },{
//                     name: `Sports_Tickets`,
//                     value: `sports_tickets`,
//                 },{
//                     name: `Student_Financial_Services`,
//                     value: `sfs`,
//                 },{
//                     name: `Study_Abroad`,
//                     value: `studyabroad`,
//                 },{
//                     name: `TUid_virtual`,
//                     value: `tuid_virtual`,
//                 },{
//                     name: `TUid_physical`,
//                     value: `tuid_physical`,
//                 },{
//                     name: `TUportal`,
//                     value: `tuportal`,
//                 },{
//                     name: `Tuttleman_Counseling_Services`,
//                     value: `tuttleman`,
//                 }
//             ],
//         },{
//             name: `school`,
//             description: `Specify the school for the link (if applicable).`,
//             type: 'STRING',
//             required: false,
//             choices: [
//                 {
//                     name: `Beasley_School_of_Law`,
//                     value: `beasley`,
//                 },{
//                     name: `Boyer_College_of_Music_and_Dance`,
//                     value: `boyer`,
//                 },{
//                     name: `College_of_Education_and_Human_Development`,
//                     value: `education`,
//                 },{
//                     name: `College_of_Engineering`,
//                     value: `engineering`,
//                 },{
//                     name: `College_of_Liberal_Arts`,
//                     value: `cla`,
//                 },{
//                     name: `College_of_Public_Health`,
//                     value: `cph`,
//                 },{ 
//                     name: `College_of_Science_and_Technology`,
//                     value: `cst`,
//                 },{
//                     name: `Fox_School_of_Business`,
//                     value: `fox`,
//                 },{
//                     name: `Lew_Klein_College_of_Media_and_Communication`,
//                     value: `lewklein`,
//                 },{
//                     name: `Lewis_Katz_School_of_Medicine`,
//                     value: `medicine`,
//                 },{
//                     name: `Maurice_H._Kornberg_School_of_Dentistry`,
//                     value: `dentistry`,
//                 },{
//                     name: `School_of_Pharmacy`,
//                     value: `pharmacy`,
//                 },{
//                     name: `School_of_Podiatric_Medicine`,
//                     value: `podiatricmedicine`,
//                 },{
//                     name: `School_of_Social_Work`,
//                     value: `socialwork`,
//                 },{
//                     name: `School_of_Sport_Tourism_and_Hospitality_Management`,
//                     value: `sthm`,
//                 },{
//                     name: `School_of_Theater,_Film_and_Media Arts`,
//                     value: `theaterfilmmedia`,
//                 },{
//                     name: `Tyler_School_of_Art_and_Architecture`,
//                     value: `tyler`,
//                 },{
//                     name: `University_Studies`,
//                     value: `universitystudies`,
//                 }
//             ],
//         }
//     ],
//     defaultPermission: true,
//     run: async(client, interaction, inputs) => {

//         let linkName;
//         let link;

//         // FETCHING NAME AND LINK
//         switch(inputs[0]) {
//             // ACADEMIC PLANS
//             case 'academic_plan':
//                 linkName = `Academic Plans and Suggested Timelines`;
//                 link = `https://bulletin.temple.edu/undergraduate/schools-colleges/`;
//                 break;

//             case 'admissions':
//                 switch(inputs[1]) {
//                     case `beasley`:
//                         linkName = `Admissions - Beasley Law`;
//                         link = `https://law.temple.edu/admissions/jd/`;
//                         break;
//                     case `boyer`:
//                         linkName = `Admissions - Boyer Music & Dance`;
//                         link = `https://boyer.temple.edu/admissions/`;
//                         break;
//                     case `education`:
//                         linkName = `Admissions - College of Education`;
//                         link = `https://education.temple.edu/admissions/`;
//                         break;
//                     case `engineering`:
//                         linkName = `Admissions - College of Engineering`;
//                         link = `https://engineering.temple.edu/admissions/`;
//                         break;
//                     case `cla`:
//                         linkName = `Admissions - College of Liberal Arts`;
//                         link = `https://liberalarts.temple.edu/admissions/`;
//                         break;
//                     case `cph`:
//                         linkName = `Admissions - College of Public Health`;
//                         link = `https://cph.temple.edu/admissions/`;
//                         break;
//                     case `cst`:
//                         linkName = `Admissions - College of Science & Technology`;
//                         link = `https://cst.temple.edu/admissions/`;
//                         break;
//                     case `fox`:
//                         linkName = `Admissions - Fox School of Business`;
//                         link = `https://www.fox.temple.edu/undergraduate-programs/honors/admissions/`;
//                         break;
//                     case `lewklein`:
//                         linkName = `Admissions - Media and Communication`;
//                         link = `https://klein.temple.edu/admissions-cost-and-aid/`;
//                         break;
//                     case `medicine`:
//                         linkName = `Admissions - Medicine`;
//                         link = `https://medicine.temple.edu/admissions/`;
//                         break;
//                     case `dentistry`:
//                         linkName = `Admissions - Dentistry`;
//                         link = `https://www.temple.edu/academics/degree-programs/dentistry-dmd-dn-dent-dmd/admissions/`;
//                         break;
//                     case `pharmacy`:
//                         linkName = `Admissions - School of Pharmacy`;
//                         link = `https://pharmacy.temple.edu/admissions/`;
//                         break;
//                     case `podiatricmedicine`:
//                         linkName = `Admissions - School of Podiatric Medicine`;
//                         link = `https://podiatry.temple.edu/admissions/`;
//                         break;
//                     case `socialwork`:
//                         linkName = `Admissions - School of Social Work`;
//                         link = `https://www.temple.edu/academics/degree-programs/graduate-programs/social-work---graduate-msw-sswg/social-work-msw-admissions-information/`;
//                         break;
//                     case `sthm`:
//                         linkName = `Admissions - Sport Tourism, Hospitality Management`;
//                         link = `https://admissions.temple.edu/apply/`;
//                         break;
//                     case `theaterfilmmedia`:
//                         linkName = `Admissions - Theater, Film, Media Arts`;
//                         link = `https://tfma.temple.edu/admissions/`;
//                         break;
//                     case `tyler`:
//                         linkName = `Admissions - Tyler School of Art & Architecture`;
//                         link = `https://tyler.temple.edu/undergraduate-admissions/`;
//                         break;

//                     default:
//                         linkName = `Admissions - Temple University`;
//                         link = `https://www.temple.edu/admissions`;
//                         break;
//                 }
//             break;

//             case 'advising':
//                 switch(inputs[1]) {
//                     case `beasley`:
//                         linkName = `Advising - Beasley Law`;
//                         link = `https://law.temple.edu/resources/student-services/course-registration/academic-advising/`;
//                         break;
//                     case `boyer`:
//                         linkName = `Advising - Boyer Music & Dance (Varies by program)`;
//                         link = `https://boyer.temple.edu/academic-programs/programs/undergraduate-programs/`;
//                         break;
//                     case `education`:
//                         linkName = `Advising - College of Education (Visit your college's tab on TUportal)`;
//                         link = `https://tuportal5.temple.edu/`;
//                         break;
//                     case `engineering`:
//                         linkName = `Advising - College of Engineering (Visit your college's tab on TUportal)`;
//                         link = `https://tuportal5.temple.edu/`;
//                         break;
//                     case `cla`:
//                         linkName = `Advising - College of Liberal Arts`;
//                         link = `https://liberalarts.temple.edu/students/academic-advising/`;
//                         break;
//                     case `cph`:
//                         linkName = `Advising - College of Public Health`;
//                         link = `https://cph.temple.edu/academics/academic-advising-and-student-resources/advising-staff`;
//                         break;
//                     case `cst`:
//                         linkName = `Advising - College of Science & Technology`;
//                         link = `https://cst.temple.edu/students/undergraduate-academic-advising`;
//                         break;
//                     case `fox`:
//                         linkName = `Advising - Fox School of Business`;
//                         link = `https://www.fox.temple.edu/advising/`;
//                         break;
//                     case `lewklein`:
//                         linkName = `Advising - Media and Communication`;
//                         link = `https://klein.temple.edu/student-life/office-academic-advising`;
//                         break;
//                     case `medicine`:
//                         linkName = `Advising - Medicine`;
//                         link = `https://medicine.temple.edu/academic-advising`;
//                         break;
//                     case `dentistry`:
//                         linkName = `Advising - Dentistry (Not Found)`;
//                         link = `https://dentistry.temple.edu/`;
//                         break;
//                     case `pharmacy`:
//                         linkName = `Advising - School of Pharmacy (Not Found)`;
//                         link = `https://pharmacy.temple.edu/`;
//                         break;
//                     case `podiatricmedicine`:
//                         linkName = `Advising - School of Podiatric Medicine (Not Found)`;
//                         link = `https://podiatry.temple.edu/`;
//                         break;
//                     case `socialwork`:
//                         linkName = `Advising - School of Social Work`;
//                         link = `https://bulletin.temple.edu/undergraduate/social-work/#advisingtext`;
//                         break;
//                     case `sthm`:
//                         linkName = `Advising - Sport Tourism, Hospitality Management`;
//                         link = `https://sthm.temple.edu/current-students/center-for-student-services/student-advising/`;
//                         break;
//                     case `theaterfilmmedia`:
//                         linkName = `Advising - Theater, Film, Media Arts`;
//                         link = `https://tfma.temple.edu/tfma-advising`;
//                         break;
//                     case `tyler`:
//                         linkName = `Advising - Tyler School of Art & Architecture`;
//                         link = `https://tyler.temple.edu/academic-advising-0`;
//                         break;
//                     case `universitystudies`:
//                         linkName = 'Advising - University Studies';
//                         link = `https://www.temple.edu/vpus/arc/about/index.html#appointments`;

//                     default:
//                         linkName = `Advising - Temple University`;
//                         link = ``;
//                         break;
//                 }
//             break;

//             case 'athletics':
//             case 'sports':
//             case 'sports_tickets':
//                 linkName = `Athleteics & Tickets`
//                 link = `https://owlsports.com/`
//                 break;
      
//             case 'canvas':
//                 linkName = `Canvas`
//                 link = `https://templeu.instructure.com/`
//                 break;

//             case 'clubs_orgs':
//                 linkName = `Clubs & Organizations`
//                 link = `https://temple.campuslabs.com/engage/`
//                 break;

//             case 'course_catalog':
//                 linkName = `Course Catalog`
//                 link = `https://prd-xereg.temple.edu/StudentRegistrationSsb/ssb/term/termSelection?mode=courseSearch`
//                 break;

//             case 'dars':
//                 linkName = `DARS (Degree Audit Reporting System)`
//                 link = `https://dars.temple.edu/`
//                 break;

//             case 'dining':
//                 linkName = `Dining`
//                 link = `https://temple.campusdish.com/`
//                 break;

//             case 'discord':
//                 linkName = `Use this link to join the Temple University Discord`
//                 link = `https://discord.com/invite/vbtaBXt8dd`
//                 break;

//             case 'finals':
//                 linkName = `Final Exam Schedules`
//                 link = `https://registrar.temple.edu/exam-schedule`
//                 break;

//             case 'financial_aid':
//             case 'sfs':
//                 linkName = `Student Financial Services`
//                 link = `https://sfs.temple.edu/about/appointments`
//                 break;
    
//             case 'housing':
//                 linkName = `Housing`
//                 link = `https://housing.temple.edu/`
//                 break;

//             case 'studyabroad':
//                 linkName = `Study Abroad`
//                 link = `https://studyabroad.temple.edu/`
//                 break;

//             case 'tuid_virtual':
//                 linkName = `Get Your Virtual TUid`
//                 link = `https://prd-challenger.erp.temple.edu/luminis_gettuid/tu_getmytuid_1.aspx`
//                 break;

//             case 'tuid_physical':
//                 linkName = 'TUid Physical Card - Schedule an Appointment'
//                 link = `https://booktuod.timetap.com/#/`
//                 break;

//             case 'tuportal':
//                 linkName = `TUPortal`
//                 link = `https://tuportal5.temple.edu/`
//                 break;

//             case 'tuttleman':
//                 linkName = `Tuttleman Counseling Services`
//                 link = `https://counseling.temple.edu/`
//                 break;
//         }


//         let linkButton = new MessageButton()
//             .setLabel(`${linkName}`)
//             .setStyle("LINK")
//             .setURL(`${link}`)
//             .setDisabled(false)


//         // BUTTON ROW
//         let buttonRow = new MessageActionRow()
//             .addComponents(
//                 linkButton
//             );


//         // POSTING LINK USING VALUES FROM ABOVE
//         interaction.reply({ content: `Here you go!`, components: [buttonRow] })
//     }
// }