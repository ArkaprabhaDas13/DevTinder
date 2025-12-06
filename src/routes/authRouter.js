const express = require('express');
const UserModel = require('../models/user')
const { validationFunction } = require('../utils/validation')
const bcrypt = require('bcrypt')
const { tokenValidation } = require('../middlewares/tokenValidation')


const authRouter = express.Router(); 

// SIGNING IN AN USER
authRouter.post("/signup", validationFunction, async (req, res) => {

    const { firstName, lastName, email, password } = req.body;

    ////  HASHING THE PASSWORD before storing in the DB ..........................
    const hashedPass = bcrypt.hashSync(password, 10);

    const user = new UserModel({ firstName, lastName, email, password: hashedPass })        // THIS IS A VERY BAD WAY to create a new USER!!!!!!!     

    ////  here as we have used express.json(), we can easily parse the req in JSON format        

    try {
        await user.save();
        res.send("User added successfully !!!");
    }
    catch (err) {
        console.log("ERROR = ", err);
        res.status(400).send("Error in post req for database");
    }

})

// LOGIN USER 
authRouter.post('/login', async (req, res) => { 
    try {
        const { email, password } = req.body;

        // here findOne returns only one result
        // find returns an array even if the number of results is 1
        // so for using schema methods, its better to use findOne()
        const user = await UserModel.findOne({ email: email });           // finding the user with the Login email using INDEXING
        if (!user) {
            throw new Error("ERROR : Authentication Error! Check email and password.");
        }
        const hashedPass = user.password;
        const match = await user.decryptPass(password);
        if (match) {
            // CREATING A JWT TOKEN FOR THE FIRST LOGIN ------------------------------------------------------------------------
            // const token = jwt.sign({_id : user._id}, "secret", {expiresIn : '1d'});
            const token = await user.createJWT();
            res.cookie("token", token).send("Login SUCCESSFUL!");                 // sending the TOKEN in the COOKIE to the browser/postman to store it for future uses
            
        } else {
            res.status(400).send("ERROR: Incorrect Password!");
        }

    } catch (e) {
        res.status(400).send(e.message);
    }
})


// LOGOUT USER

authRouter.post('/logout', (req, res)=>{
    res.clearCookie("token").send("LOGGED OUT!!");
})


// FORGOT PASSWORD : when we are forgetting the password, we will only enter the email and new password. We will create a validation to check if the retyped new password is the same as the new password. Then we will update the user in the DB.

authRouter.post('/forgotPassword', tokenValidation, async (req, res)=>{
    
    const allowedFields = ["email", "password"];
    const isValid = Object.keys(req.body).forEach((item)=>(
        allowedFields.includes(item)
    ))
    if(isValid)
    {
        
    }
})


module.exports = authRouter;