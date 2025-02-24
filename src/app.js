const express = require('express');
const admin = require('./middlewares/adminAuth')
// const { adminAuth, userAuth } = require('./middlewares/adminAuth');
const connectDB = require('../src/config/database')
const UserModel = require('../src/models/user')
const validator = require('validator')
const { validationFunction } = require('./utils/validation')
const bcrypt = require('bcrypt')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const { tokenValidation } = require('./middlewares/tokenValidation')

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
