const mongoose = require('mongoose');
const mongouri = process.env.MONGO_URI;

const connectToMongo = () => {
    mongoose.connect(mongouri, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        useUnifiedTopology: true,
        // useFindAndModify: false
    }).then(console.log("connected to mongo")).catch((err) => { console.log(err) })
}

module.exports = connectToMongo;