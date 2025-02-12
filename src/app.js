const express = require('express');
const admin = require('./middlewares/adminAuth')
const {adminAuth, userAuth} = require('./middlewares/adminAuth');
const connectDB = require('../src/config/database')
const {UserModel} = require('../src/models/user')
const validator = require('validator')
const {validationFunction} = require('./utils/validation')
const bcrypt = require('bcrypt')

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

    //As soon as we get the details of the USER, 1. We will validate the Data, 2. Encrypt the data

    //// 1. Validate DATA ......................

    try{
        validationFunction(req)
    }catch(e){
        return res.send(e.message);
    }

    const {firstName, lastName, email, password} = req.body;

    //// 2. HASHING THE PASSWORD before storing in the DB..........................

    const hashedPass = bcrypt.hashSync(password, 10);

    const user = new UserModel({firstName, lastName, email, password: hashedPass})        // THIS IS A VERY BAD WAY to create a new USER!!!!!!!     

    // //  here as we have used express.json(), we can easily parse the req in JSON format

    try{

        await user.save();
        res.send("User added successfully!!!")
    }
    catch(err){
        console.log("ERROR = ", err);
        res.status(400).send("Error in post req for database")
    }
})


// LOGIN USER
app.post('/login', async (req, res)=>{

    try{
        
        const {email, password} = req.body;

        const user = await UserModel.findOne({email: email});
        if(!user)
        {
            throw new Error("ERROR : Authentication Error! Check email and password.");
        }
        
        const hashedPass = user.password;
        const match = await bcrypt.compare(password, user.password); 

        if (match) {
            res.send("Login SUCCESSFUL!");
        } else {
            res.status(400).send("ERROR: Incorrect Password!");
        }


    }catch(e){
        res.status(400).send(e.message);
    }
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
    // const name = req.params.name;
    console.log(id);
    // console.log(name);

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
