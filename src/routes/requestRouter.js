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
requestRouter.post(`/request/send/:status/:toUserId`, tokenValidation, async (req, res) => {
    try{
        
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId
        const status  = req.params.status
        const name = req.query.name

        // now we have to verify the status : "Interested" and "Ignored"
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
