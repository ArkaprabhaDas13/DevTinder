const express = require('express');
const requestRouter = express.Router();
const {tokenValidation} = require('../middlewares/tokenValidation');
const ConnectionRequest = require('../models/connectionRequest');
const UserModel = require('../models/user');

// Statuses : IGNORED and INTERESTED

requestRouter.post('/send/:status/:toUserId', tokenValidation, async (req, res)=>{
    try{
        
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // 1. Check for STATUS value 
        const acceptedStatus = ["ignored", "interested"];
        const isStatusValid = acceptedStatus.includes(status);
        if(!isStatusValid)
        {
            // both will work
            throw new Error(`invalid Status type : ${status}`)
            // return res.status(400).json({message: "invalid status type : "+status})
        }

        // 2. Check if the connection request exists for the same users or vice versa
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId: fromUserId, toUserId: toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })
        if(existingConnectionRequest)
        {
            throw new Error(`Connection Request already exists : ${existingConnectionRequest}`);
        }

        // 3. Check if the toUserId exists inside the DB
        const doesToUserIdExists = await UserModel.findOne({_id: toUserId});
        if(!doesToUserIdExists)
        {
            throw new Error("User doesnt Exist in DB");
        }
        
        const connectionRequest = new ConnectionRequest({fromUserId, toUserId, status});
        const data = await connectionRequest.save();

        res.status(200).json({data});

    }catch(err){
        res.status(400).send(err.message);
    }
})


// REVIEW : ACCEPT or REJECT

requestRouter.post('/review/:status/:requestId', tokenValidation, async(req, res)=>{

    try{
        const loggedInUser = req.user._id; 
        const {status, requestId} = req.params;

        // Validate status for review endpoint
        const acceptedReviewStatus = ["accepted", "rejected"];
        if(!acceptedReviewStatus.includes(status)) {
            throw new Error(`Invalid status : ${status}. Must be 'accepted' or 'rejected'`);
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser,
            status : "interested"
        })
        if(!connectionRequest)
        {
            throw new Error("Connection not found :(");
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.status(200).json({message: "Connection request " + status})
    }catch(err)
    {
        res.status(400).send(err.message);
    }

})

module.exports = requestRouter;