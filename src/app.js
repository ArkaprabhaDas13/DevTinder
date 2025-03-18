const express = require('express');
const connectDB = require('../src/config/database')
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors());


const authRouter = require('./routes/authRouter');
const profileRouter = require('./routes/profileRouter');
const requestRouter = require('./routes/requestRouter');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter); 

connectDB()
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        })
    })
    .catch((err) => {
        console.error(err); 
    })
