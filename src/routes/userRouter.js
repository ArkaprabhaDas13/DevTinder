const express = require("express");
const { tokenValidation } = require("../middlewares/tokenValidation");
const ConnectionRequest = require("../models/connectionRequest");
// const { populate } = require("../models/user");
const userRouter = express.Router();


// SHOWS the connections who has accepted your invite or you have accepted their invitation
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


// SHOWS all the connections sent to the USER
userRouter.get('/user/connections', tokenValidation, async(req, res)=>{
    try{
        
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "gender"])
        .populate("toUserId", ["firstName", "lastName", "photoUrl", "gender"])

        // Lets say when the logged in user is sending a request to someone else,
        // and the user accepts the invite, we are only going to show the user whome the 
        // connection was sent, not the logged in user
        const data = connectionRequests.map((item)=>{
            if(item.fromUserId._id.toString() === loggedInUser._id.toString())
                return item.toUserId;

            return item.fromUserId
        })

        res.status(200).json({
            message: "Connections fetched successfully",
            data: data
        })

    }catch(err)
    {
        res.status(400).send({mmessage: err.message});
    }
})

module.exports = userRouter;

