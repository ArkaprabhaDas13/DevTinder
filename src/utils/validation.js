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

    // console.log(Object.keys(req.body));

    const editCheck = Object.keys(req.body).every((key)=>(
        editables.includes(key)
    ))

    // console.log("REQUEST BODY  ======> ", req.body);
    
    return editCheck;
}


const forgotPasswordFieldValidation = (obj) =>{

    const acceptableValues = ["email", "password", "password2"];
    const {email, password, password2} = obj;

    // console.log(obj);

    const booleanVal = Object.keys(obj).every((key)=>(
        acceptableValues.includes(key)
    ))

    return booleanVal;
}

module.exports = {validationFunction, profileEditValidation, forgotPasswordFieldValidation}