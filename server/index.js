require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');


require('./config/db')

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT; //PORT = 8080

app.get('/', (req, res) => {
    res.send('Welcome to praancare server.');
})
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);



app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})

