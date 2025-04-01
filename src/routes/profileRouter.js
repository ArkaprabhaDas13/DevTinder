const express = require('express');
const admin = require('../middlewares/adminAuth');
const { adminAuth, userAuth } = require('../middlewares/adminAuth');
const connectDB = require('../config/database')
const UserModel = require('../models/user')
const validator = require('validator')
const { validationFunction } = require('../utils/validation')
const bcrypt = require('bcrypt')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const { tokenValidation } = require('../middlewares/tokenValidation')
const {profileEditValidation} = require('../utils/validation')

const profileRouter = express.Router();

// PROFILE 
profileRouter.get('/profile', tokenValidation, async (req, res) => {
    res.send("Profile Page");
})

// PROFILE EDIT
profileRouter.patch('/profile/edit', tokenValidation, async(req, res)=>{
   
    profileEditValidation(req);
    console.log("REQ USER = ",req.user);
    res.send(req.user);

})

module.exports = profileRouter;