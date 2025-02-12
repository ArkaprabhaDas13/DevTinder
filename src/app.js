const express = require('express');
const admin = require('./middlewares/adminAuth')
const {adminAuth, userAuth} = require('./middlewares/adminAuth');
const connectDB = require('../src/config/database')
const {UserModel} = require('../src/models/user')
var validator = require('validator')

const app = express();

app.use(express.json());


// CREATING AN USER IN DB
app.post("/signup", async (req, res)=>{
    
    // THis details is coming from req.body...
    // const user = new UserModel({
    //     firstName: "Tim",
    //     lastName: "Cook",
    //     email: "tim@gmail.com",
    //     password: "123456"
    // })

    const user = new UserModel(req.body)
    //  here as we have used express.json(), we can easily parse the req in JSON format

    try{
        const validEmail = validator.isEmail(user.email);
        if(!validEmail)
        {
            throw new Error("Invalid Email!")
        }

        const oldEmail = await UserModel.findOne({email: user.email});
        if(oldEmail)
        {
            throw new Error("Email already exists!")
        }

        if(!validator.isStrongPassword(user.password))
        {
            throw new Error("Password should be strong!")
        }

        await user.save();
        res.send("User added successfully!!!")
    }
    catch(err){
        console.log("ERROR = ", err);
        res.status(400).send("Error in post req for database")
    }
    // res.send("User created SUCCESSFULLY!!!!");
})


// GETTING ALL USERS FROM DB
app.get("/getAllUsers", async (req, res)=>{
    try{
        const userData = await UserModel.find();
        console.log(userData);
        res.send(userData);
    }catch(err){
        console.error(400).log("Error = ", err);
        res.send("Error while fetching data...");
    }
})


// DELETING AN USER FROM DB BY ID
app.post("/user/delete/:userId", async(req, res)=>{
    const id = req.params.userId;
    console.log(id);

    try{
        const deletedUser = await UserModel.findByIdAndDelete({_id : id});
        res.send(deletedUser);
    }
    catch(err){
        console.error(400);
        res.send("Error while deleting user");
    }
})


// UPDATE AN USER USING PATCH
app.patch("/user/update/:userId", async(req, res)=>{

    const user = req.params?.userId;
    const data = req.body;

    try{
        // update validation for PATCH req
        const allowedUpdates = ["gender", "age", "skills", "password", "about", "photoUrl"];
        const isUpdateAllowed = Object.keys(data).every((everyItem) => allowedUpdates.includes(everyItem));
        if(isUpdateAllowed)
        {
            const updatedUser = await UserModel.findByIdAndUpdate(user , data , {returnDocument: "after", runValidators: true})           // options is an additional functionality inside an object
            res.send("Updated User = "+updatedUser);
        }
        else{
            throw new Error(" User Cannot be updated !!!");
        }
    }catch(err){
        res.send("Error while updating the User!! : "+ err);
    }
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
