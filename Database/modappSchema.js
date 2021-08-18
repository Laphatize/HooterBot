const mongoose = require ('mongoose')

module.exports = mongoose.model("moddapps", new mongoose.Schema({
    USERNAME:   {type: String},
    USER_ID:    {type: String},
    Q2:         {type: Boolean},
    Q3:         {type: Boolean},
    Q4:         {type: Boolean},
    Q5:         {type: Boolean},

},{
    timestamps: true,
    versionKey: false,
}))
