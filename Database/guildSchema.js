const mongoose = require ('mongoose')

module.exports = mongoose.model("Guild", new mongoose.Schema({
    GUILD_NAME: {type: String, required:true},
    GUILD_ID: {type: String, required:true},
    TICKET_CAT_ID: {type: String, required:true},       // CATEGORY FOR NEW TICKETS
    RULES_MSG_ID: {type: String, required:true},
    VERIF_PERKS_MSG_ID: {type: String, required:true},
    VERIF_PROMPT_MSG_ID: {type: String, required:true}
},{
    timestamps: true,
    versionKey: false,
}))