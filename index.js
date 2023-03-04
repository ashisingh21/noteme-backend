const express = require('express');
const connectToMongo = require('./db');
const app = express();
var cors = require('cors')
app.use(cors())
app.use(express.json())
connectToMongo();
const PORT = process.env.PORT || 5000;

app.use('/api/auth', require('./routes/auth'))
app.use('/api/note', require('./routes/note'))

app.listen(PORT);