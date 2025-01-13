const express = require('express');
const admin = require('./middlewares/adminAuth')
const {adminAuth, userAuth} = require('./middlewares/adminAuth');
const connectDB = require('../src/config/database')
const {UserModel} = require('../src/models/user')

const app = express();


app.post("/signup", async (req, res)=>{
    
    const user = new UserModel({
        firstName: "Tim",
        lastName: "Cook",
        email: "tim@gmail.com",
        password: "123456"
    })

    try{
        await user.save();
    }
    catch(err){
        console.log("ERROR = ", err);
        res.status(400).send("Error in post req for database")
    }
    res.send("User created SUCCESSFULLY!!!!");
})



connectDB()
.then(()=>{
    console.log('Connected to MongoDB');
    app.listen(3000, ()=>{
        console.log('Server is running on port 3000');
    })
})
.catch((err)=>{
    console.error(err);
})
