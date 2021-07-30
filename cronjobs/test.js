var cron = require('node-cron');


// EVERY MINUTE
cron.schedule('00 * * * * *', async () => {
    console.log('This is the test cron job posting from within the cronjobs folder.');
}, {
    scheduled: true,
    timezone: "America/New_York"
});
