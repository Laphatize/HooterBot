const mongoose = require ('mongoose')

module.exports = mongoose.model("Suggestions", new mongoose.Schema({
    GUILD_ID:            {type: String},
    GUILD_NAME:          {type: String},
    CREATOR_TAG:         {type: String},
    SUGGESTION_MSG_ID:   {type: String},
    SUGGESTION_NUM:      {type: Number},
    SUGGESTION_TEXT:     {type: String},
},{
    timestamps: true,
    versionKey: false,
}))