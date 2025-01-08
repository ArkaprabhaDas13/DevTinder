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

