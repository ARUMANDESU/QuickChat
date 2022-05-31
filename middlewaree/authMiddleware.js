const jwt = require("jsonwebtoken")

module.exports=function(req,res,next){
    if(req.method==="OPTIONS"){
        next();
    }   

    try {
        const token=req.cookies.auth.split(' ')[1]
        if(!token){
            return res.status(403).render("message",{user:res.user,auth:res.user,message:"User not authorized",timeout:800,where:"/home"})
        }
        const decodedData = jwt.verify(token, process.env.secret)
        req.user = decodedData
        next();
    } catch (e) {
        console.log(e);
        return  res.status(403).render("message",{user:res.user,auth:res.user,message:"User not authorized",timeout:800,where:"/home"})
    }
}