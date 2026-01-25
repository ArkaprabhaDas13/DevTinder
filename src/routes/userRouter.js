const express = require("express");
const { tokenValidation } = require("../middlewares/tokenValidation");
const ConnectionRequest = require("../models/connectionRequest");
// const { populate } = require("../models/user");
const userRouter = express.Router();


// SHOWS the connections who has accepted your invite or you have accepted their invitation
userRouter.get('/requests/received', tokenValidation, async(req, res)=>{
    try{
        const loggedInUser = req.user._id;
        
        // when we use populate, we basically get the data from the "ref" in the ConnectionRequest schema.
        // ref ---> UserModel (ref references the UserModel which means a connection is built between every key of the ConnectionReq schema to the UserModel)
        // Also dont just write populate("fromUserId") which will bring every data of the User including the email and password which we dont want
        
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"])
        


        if(connectionRequests.length === 0)
        {
            return res.status(200).json({message: "There are no requests :("});
        }

        res.json({message: "Data Fetched successfully!", data: connectionRequests}); 
   
    }catch(err){
        res.status(400).send(err.message);
    }
})


// SHOWS all the connections sent to the USER
userRouter.get('/connections', tokenValidation, async(req, res)=>{
    try{   
        const loggedInUser = req.user._id;

        // const connectionRequests = await ConnectionRequest.find({
        //     $or: [
        //         {toUserId: loggedInUser._id, status: "accepted"},
        //         {fromUserId: loggedInUser._id, status: "accepted"}
        //     ]
        // }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "gender"])
        // .populate("toUserId", ["firstName", "lastName", "photoUrl", "gender"])

        // // Lets say when the logged in user is sending a request to someone else,
        // // and the user accepts the invite, we are only going to show the user whome the 
        // // connection was sent, not the logged in user
        // const data = connectionRequests.map((item)=>{
        //     if(item.fromUserId._id.toString() === loggedInUser._id.toString())
        //         return item.toUserId;

        //     return item.fromUserId
        // })

        const connections = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser, status: "accepted"},
                {fromUserId: loggedInUser, status: "accepted"}
            ]
        }).populate("fromUserId", "firstName lastName photoUrl gender skills about")
        .populate("toUserId", "firstName lastName photoUrl gender skills about")

        // filter the connections because we dont need the data of the Logged In user
        const data = connections.map((item)=>{
            if(item.fromUserId._id.toString() === loggedInUser._id.toString())
                return item.toUserId;

            return item.fromUserId
        })

        if(data.length === 0)
        {
            return res.status(200).json({message: "No connections available 😔 "});
        }

        res.status(200).json({message: "Connections fetched successfully 😀", data: data})

    }catch(err)
    {
        res.status(400).send({mmessage: err.message});
    }
})

module.exports = userRouter;

