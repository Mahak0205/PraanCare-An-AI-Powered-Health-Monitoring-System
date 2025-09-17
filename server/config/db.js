const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL)
.then(()=>{
    console.log('MongoDB connected successfully.');
}).catch((err)=>{
    console.log('Error in connecting DB...', err);
})