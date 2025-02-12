// the POST request will be sent with a Body.Token which will contain a String. Now if this String is valid, only then the next() will run which means the execution will get back to the POST req function.
// If the String is not valid, the next() will not run and the execution will not get

export const adminAuth = (req, res, next)=>{
    if(req.body.token == "xyz")
    {
        next();
    }
    else
    {
        // res.status(401).send("Unauthorized Admin !!!");
        const err = new Error("Unauthorised Token !");
        next(err);
    }
}


export const userAuth = (req, res, next)=>{
    if(req.body.token == "abc")
    {
        next();
    }
    else
    {
        res.status(401).send("Unauthorized User !!!");
    }
}

