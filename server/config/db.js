const mongoose = require('mongoose');
const MONGO_DB_CONNECTION_STRING = process.env.DB_URL;

mongoose.connect(MONGO_DB_CONNECTION_STRING)
.then(()=>{
    console.log('MongoDB connected successfully.');
}).catch((err)=>{
    console.log('Error in connecting DB...', err);
})