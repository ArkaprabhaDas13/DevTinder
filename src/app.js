const express = require('express');
const admin = require('./middlewares/adminAuth')
const { adminAuth, userAuth } = require('./middlewares/adminAuth');
const connectDB = require('../src/config/database')
const UserModel = require('../src/models/user')
const validator = require('validator')
const { validationFunction } = require('./utils/validation')
const bcrypt = require('bcrypt')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const { tokenValidation } = require('./middlewares/tokenValidation')

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());


// CREATING AN USER IN DB
app.post("/signup", validationFunction, async (req, res) => {

    // THis details is coming from req.body...
    // const user = new UserModel({
    //     firstName: "Tim",
    //     lastName: "Cook",
    //     email: "tim@gmail.com",
    //     password: "123456"
    // })

    //As soon as we get the details of the USER, 1. We will validate the Data, 2. Encrypt the data

    //// 1. Validating the Email Passwords and other inputs using Middleware

    const { firstName, lastName, email, password } = req.body;

    //// 2. HASHING THE PASSWORD before storing in the DB..........................

    const hashedPass = bcrypt.hashSync(password, 10);

    const user = new UserModel({ firstName, lastName, email, password: hashedPass })        // THIS IS A VERY BAD WAY to create a new USER!!!!!!!     

    // //  here as we have used express.json(), we can easily parse the req in JSON format

    try {

        await user.save();
        res.send("User added successfully!!!")
    }
    catch (err) {
        console.log("ERROR = ", err);
        res.status(400).send("Error in post req for database")
    }
})

// LOGIN USER
app.post('/login', async (req, res) => { 
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            throw new Error("ERROR : Authentication Error! Check email and password.");
        }
        const hashedPass = user.password;
        const match = await user.decryptPass(password);
        if (match) {
            // CREATING A JWT TOKEN FOR THE FIRST LOGIN ------------------------------------------------------------------------
            // const token = jwt.sign({_id : user._id}, "secret", {expiresIn : '1d'});
            const token = await user.createJWT();
            res.cookie("token", token)                  // sending the TOKEN in the COOKIE to the browser/postman to store it for future uses
            res.send("Login SUCCESSFUL!");
        } else {
            res.status(400).send("ERROR: Incorrect Password!");
        }

    } catch (e) {
        res.status(400).send(e.message);
    }
})

// PROFILE 
app.get('/profile', tokenValidation, async (req, res) => {

    //--------------all these are written inside the tokenValidation Middleware---------------//
    // const cookie = req.cookies.token;
    // const decoded = jwt.verify(cookie, "secret");
    // decoded ? console.log("Decoded value = ", decoded) : console.log("Not a valid token!!");
    // const user = await UserModel.findById(decoded._id);
    //--------------------------------------------------------------------//

    res.send("Profile Page");
})

//sendConnectionRequest
app.post('/sendConnectionRequest', tokenValidation, (req, res) => {
    console.log("User sending connection req = " + req.user.firstName + " " + req.user.lastName);
    res.send("Connection request sent!");
})


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
