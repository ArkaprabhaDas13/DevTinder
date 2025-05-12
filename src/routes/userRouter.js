const express = require("express");
const { tokenValidation } = require("../middlewares/tokenValidation");
const ConnectionRequest = require("../models/connectionRequest");
const { populate } = require("../models/user");
const userRouter = express.Router();

userRouter.get('/user/requests/received', tokenValidation, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status: "accepted"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"])
         
        res.json({message: "Data Fetched successfully!", data: connectionRequests}); 
   
    }catch(err){
        res.status(400).send(err.message);
    }
})

module.exports = userRouter;

