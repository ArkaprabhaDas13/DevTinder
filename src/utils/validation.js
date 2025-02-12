const validator = require('validator')

const validationFunction = (req)=>{
    
    const {firstName, lastName, email, password} = req.body;

    if(!firstName && !lastName)
    {
        throw new Error("Error : Missing Name");
    }
    if(!validator.isEmail(email))
    {
        throw new Error("Error : Incorrect Email");
    }
    if(!validator.isStrongPassword(password))
    {
        throw new Error("Error : Give a Stronger Password");
    }
}

module.exports = {validationFunction}