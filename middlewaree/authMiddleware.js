const jwt = require("jsonwebtoken")
const {secret}= require("../config")

module.exports=function(req,res,next){
    if(req.method==="OPTIONS"){
        next();
    }   

    try {
        const token=req.cookies.auth.split(' ')[1]
        if(!token){
            return res.status(403).json({message:`User not authorized`})
        }
        const decodedData = jwt.verify(token, secret)
        req.user = decodedData
        next();
    } catch (e) {
        console.log(e);
        return res.status(403).json({message:`User not authorized`})
    }
}