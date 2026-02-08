const express = require("express");
const { tokenValidation } = require("../middlewares/tokenValidation");
const ConnectionRequest = require("../models/connectionRequest");
const UserModel = require("../models/user");
const userRouter = express.Router();


// SHOWS all the connections sent to the USER
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


// SHOWS the connections who have accepted your invite or you have accepted their invitation
userRouter.get('/connections', tokenValidation, async(req, res)=>{
    try{   
        const loggedInUser = req.user._id;

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
            else
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


// FEED PAGE: 
// 1. People whome the logged in user has not sent a connection request (ignored/interested)
// 2. Logged in user should not see HIMSELF
// 3. Logged in user's connections

userRouter.get("/feed", tokenValidation, async(req, res)=>{

    try{
        const loggedInUser = req.user._id;
        
        let notInFeedData = await ConnectionRequest.find({$or: [
            {fromUserId : loggedInUser},
            {toUserId : loggedInUser}, 
        ]})

        const hideUsers = new Set();
        notInFeedData.forEach((item)=>{
            hideUsers.add(item.fromUserId.toString());
            hideUsers.add(item.toUserId.toString());
        })

        // console.log("Not in feed = ", hideUsers);

        const feed = await UserModel.find({
            $and: [
                {_id: {$nin: Array.from(hideUsers)}},
                {_id: {$ne: loggedInUser}}
            ]}).select("firstName lastName photoUrl gender skills about");     
        res.status(200).send({data: feed});
    }catch(err)
    {
        res.status(400).send({message: err.message})
    }
})


module.exports = userRouter;

