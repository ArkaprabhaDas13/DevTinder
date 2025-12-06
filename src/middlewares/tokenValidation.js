const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

const tokenValidation = async (req, res, next)=>{

    try{
        const {token} = req.cookies;                    // extracting the token from the cookies

        if(!token)
        {
            throw new Error("Invalid Token!! Login Again"); 
        }

        const decoded = await jwt.verify(token, "secret");
        const {_id} = decoded;
        // console.log("Decoded id = ", _id); 

        const user = await UserModel.findById(_id);

        if(!user)
        {
            throw new Error("User Doesnt Exist !!!")
        }

        /// So here we are adding the User details in the REQUEST itself 
        req.user = user;

        next();
    }catch(err){
        res.status(400).send("Error = " + err.message);
    }    

}

module.exports = {tokenValidation}