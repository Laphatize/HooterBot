const mongoose = require ('mongoose')

module.exports = mongoose.model("Guild", new mongoose.Schema({
    
    // GUILD NAME:
    GUILD_NAME: {type: String, required:true},
    
    // GUILD ID:
    GUILD_ID: {type: String, required:true},

    // DATE BOT JOINS SERVER:
    REGISTERED: {type: String, default: Date.now(), required:true},

    // DEFAULT PREFIX SET IN command-base.js
    PREFIX: {type: String, required:true},

    // CATEGORY FOR NEW TICKETS
    TICKET_CAT_ID: {type: String, required:true},

    // VERIFICATION PROMPT CHANNEL ID
    VERIF_PROMPT_CH_ID: {type: String, required:true},

    // VERIFICATION PROMPT MESSAGE ID
    VERIF_PROMPT_MSG_ID: {type: String, required:true}
},{
    timestamps: true,
    versionKey: false,
}))