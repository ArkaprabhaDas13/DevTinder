const validator = require('validator')

const validationFunction = (req, res, next)=>{
    
    const {firstName, lastName, email, password} = req.body;

    if(!firstName && !lastName)
    {
        return next(new Error("Error : Missing Name"));
    }
    if(!validator.isEmail(email))
    {
        return next(new Error("Error : Incorrect Email"));
    }
    if(!validator.isStrongPassword(password))
    {
        return next(new Error("Error : Give a Stronger Password"));
    }

    next();
}


const profileEditValidation = (req)=>{
    const editables = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"];

    const editCheck = Object.keys((key)=>(
        editables.includes(key)
    ))
    console.log("REQUEST BODY  ======> ", req.body);
    
    return editCheck;
}

module.exports = {validationFunction, profileEditValidation}