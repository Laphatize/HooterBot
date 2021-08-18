const mongoose = require ('mongoose')

module.exports = mongoose.model("moddapps", new mongoose.Schema({
    USERNAME:     {type: String},
    USER_ID:      {type: String},
    FIRST_Q:    {type: Boolean},
    SECOND_Q:   {type: Boolean},
    THIRD_Q:    {type: Boolean},
    FOURTH_Q:   {type: Boolean},
    FIFTH_Q:    {type: Boolean},
},{
    timestamps: true,
    versionKey: false,
}))
