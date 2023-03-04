
const mongoose = require('mongoose')
require('dotenv').config()
const mongouri = process.env.MONGO_URL;

const connectToMongo = () => {
    mongoose.connect(mongouri,
        { useNewUrlParser: true, useUnifiedTopology: true }).then(console.log("connected to mongo")).catch((err) => { console.log(err) })


}

module.exports = connectToMongo;