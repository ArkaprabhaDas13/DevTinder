const express = require('express');
const admin = require('./middlewares/adminAuth')
const {adminAuth, userAuth} = require('./middlewares/adminAuth');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/admin", adminAuth)

app.get("/admin/getAllData", (req, res)=>{
    // throw new Error("FAKE ERROR !!!")
    res.send("All data fetched !")
})

app.get("/admin/deleteAllData", (req, res)=>{
    res.send("All data deleted !")
})

app.get("/user/getAllData", userAuth, (req, res)=>{
    res.send("All USER data fetched !")
})

app.post("/user/registerUser", userAuth, (req, res)=>{
    res.send("User registered !")
})

app.use("/", (err, req, res, next)=>{
    console.error(err.message); 
    res.status(400).send(err.message);
})

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})