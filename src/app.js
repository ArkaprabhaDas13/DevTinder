const express = require('express');

const app = express();

app.use("/api", (req, res)=>{
    res.send("This is the server use api")
})

app.use("/test", (req, res)=>{
    res.send("This is the server use test")
})

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})