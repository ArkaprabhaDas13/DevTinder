const express = require('express');

const app = express();

app.use('/', 
    (req, res, next)=>{
        // res.send("Home route")
        next();
    },
    (req, res, next)=>{
        console.log("2nd function")
        // res.send("Home route 2")
    },
    (req, res, next)=>{
        console.log("3rd function")
        res.send("Home route 3")
        // next();
    }
)

// app.get("/te*st", (req, res)=>{
//     res.send("TEST")
// })
// app.get("/user/:userid/:username", (req, res)=>{
//     console.log(req.query); 
//     console.log(req.params.username)
//     res.send("HOME")
// })

// app.post("/user", (req, res)=>{
//     res.send("POST user")
// })

// app.delete("/user", (req, res)=>{
//     res.send("DELETE user") 
// })

// app.put("/user", (req, res)=>{
//     res.send("PUT user")
// })

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})