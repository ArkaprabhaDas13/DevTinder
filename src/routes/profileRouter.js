const express = require('express');
const { tokenValidation } = require('../middlewares/tokenValidation')
const {profileEditValidation} = require('../utils/validation')

const profileRouter = express.Router();

// PROFILE 
profileRouter.get('/view', tokenValidation, async (req, res) => {
    try{
        res.send(req.user);
    }catch(err){
        
    }
})

// PROFILE EDIT
profileRouter.patch('/edit', tokenValidation, async(req, res)=>{
   
    try{
        const booleanValue = profileEditValidation(req);
        // console.log("REQ USER CHECK = ", booleanValue);
        if(!booleanValue)
        {
            throw new Error("Invalid User Request");
        }
        else                                        // the field are present for editing
        {
            console.log(req.body);
            const user = req.user;
            // UserModel.findOneAndUpdate({_id: req.user._id}, req.body);
            // console.log("NEW USER ====> ",  UserModel.findById(req.body._id))
            console.log("USER ----->", user);

            //we are replacing the previous values with the new values
            Object.keys(req.body).every((key)=>(
                user[key] = req.body[key]
            ))

            user.save();
            // console.log(user);
        }
        res.status(200).send(req.user);
    }catch(err){
        res.status(400).send(err.message)
    }
})

module.exports = profileRouter;