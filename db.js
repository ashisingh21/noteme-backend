const mongoose = require('mongoose');
const mongouri = "mongodb+srv://ashi888032:Mongodb%401234@cluster0.dqsz264.mongodb.net/noteme";

const connectToMongo = () => {
    mongoose.connect(mongouri, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        useUnifiedTopology: true,
        // useFindAndModify: false
    }).then(console.log("connected to mongo")).catch((err) => { console.log(err) })
}

module.exports = connectToMongo;