const MongoClient = require('mongoose')
let mongoUser = process.env.mongoUser;
let mongoPswrd = process.env.mongoPswrd;
let mongoDbName = process.env.mongoDbName;

const MongoPath = `mongodb+srv://${mongoUser}:${mongoPswrd}@cluster0.pwonb.mongodb.net/${mongoDbName}?retryWrites=true&w=majority`

module.exports = async() => {
    await MongoClient.connect(MongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
  
    return MongoClient
}