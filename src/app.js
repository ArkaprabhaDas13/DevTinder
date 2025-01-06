const express = require('express');

const app = express();


app.get("/te*st", (req, res)=>{
    res.send("TEST")
})
app.get("/user/:userid/:username", (req, res)=>{
    console.log(req.query); 
    console.log(req.params.username)
    res.send("HOME")
})

app.post("/user", (req, res)=>{
    res.send("POST user")
})

app.delete("/user", (req, res)=>{
    res.send("DELETE user") 
})

app.put("/user", (req, res)=>{
    res.send("PUT user")
})

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})