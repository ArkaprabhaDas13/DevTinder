const express = require('express');
const admin = require('../middlewares/adminAuth')
const { adminAuth, userAuth } = require('../middlewares/adminAuth');
const connectDB = require('../config/database')
const UserModel = require('../models/user')
const validator = require('validator')
const { validationFunction } = require('../utils/validation')
const bcrypt = require('bcrypt')
const cors = require('cors')
// const cookieParser = require('cookie-parser');
const { tokenValidation } = require('../middlewares/tokenValidation')
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest')


//sendConnectionRequest
requestRouter.post(`/request/send/:status/:toUserId`, tokenValidation, async (req, res, next) => {
    try{
        
        const fromUserId = req.user._id.toString();
        const toUserId = req.params.toUserId.toString();
        const status  = req.params.status;
        const name = req.query.name;

        

        // // CHECK 1 : Make sure the fromUserID is not equal to the toUserID
        // (However this problem is solved using a PRE-funciton in the Schema which runs whenever the save() is used for that model)
        
        // if(fromUserId === toUserId)
        // {
        //     return res.status(400).send("Cannot send request to yourself!");
        // }

        // CHECK 2 : now we have to verify the status : "Interested" and "Ignored" only
        const allowedStatus = ["interested", "ignored"];
        if(!allowedStatus.includes(status))
        {
            return res.status(400).json({error:"Invalid status type!"})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })


        // CHECK 3 : before we save to the DB, we should check if the Connection Request already exists
        // for 'sender to receiver' and for 'receiver to sender'
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {
                    fromUserId : fromUserId,
                    toUserId : toUserId
                },
                {
                    fromUserId : toUserId,
                    toUserId: fromUserId
                }
            ]
        })
        if(existingConnectionRequest)
        {
            return res.status(400).send({message:"connection request already exists"});
        }
        

        // CHECK 4 : check if the USER ID is a valid id and exists in the DB
        const presentUser = await UserModel.findById(toUserId);
        if(!presentUser)
        {
            return res.status(400).send({message: "User ID doesnt exist !!"})
        }


        //....... saving the connection to the DB
        const data = await(connectionRequest.save())

        res.json({
            message: "Connection Req was sent successfully",
            data: data
        });

    }catch(err){
        res.status(400).send(`Error Message: ${err.message}`)
    }
}) 

// TestRouterForCookies

requestRouter.get('/req', (req, res)=>{

    console.log(req.cookies.token)

    // console.log(token);
    res.send("REQ path");
})


module.exports = requestRouter;
