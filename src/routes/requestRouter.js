const express = require('express');
const admin = require('../middlewares/adminAuth')
const { adminAuth, userAuth } = require('../middlewares/adminAuth');
const connectDB = require('../config/database')
const UserModel = require('../models/user')
const validator = require('validator')
const { validationFunction } = require('../utils/validation')
const bcrypt = require('bcrypt')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const { tokenValidation } = require('../middlewares/tokenValidation')

const requestRouter = express.Router();

//sendConnectionRequest
requestRouter.post('/sendConnectionRequest', tokenValidation, (req, res) => {
    const user = req.user;
    console.log("User sending connection req = " + user.firstName + " " + user.lastName);
    res.send("Connection request sent!");
}) 


module.exports = requestRouter;