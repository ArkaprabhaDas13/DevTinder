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

module.exports = {validationFunction}