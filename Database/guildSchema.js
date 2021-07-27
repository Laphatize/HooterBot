const mongoose = require ('mongoose')

module.exports = mongoose.model("Guild", new mongoose.Schema({
    
    // GUILD NAME:
    GUILD_NAME: {type: String, required:true},
    
    // GUILD ID:
    GUILD_ID: {type: String, required:true},

    // CATEGORY FOR NEW TICKETS
    TICKET_CAT_ID: {type: String, required:true},

    // RULES EMBED MESSAGE ID
    RULES_MSG_ID: {type: String, required:true},

    // VERIFICATION PERKS MESSAGE ID
    VERIF_PERKS_MSG_ID: {type: String, required:true},
    
    // VERIFICATION PROMPT MESSAGE ID
    VERIF_PROMPT_MSG_ID: {type: String, required:true}
},{
    timestamps: true,
    versionKey: false,
}))