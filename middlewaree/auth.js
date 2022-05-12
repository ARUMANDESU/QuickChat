const jwt = require('jsonwebtoken')
const User = require("../modules/User")
const Role = require("../modules/Role")

module.exports = function () {
    return async function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        if(req.cookies.auth){
            try {
                const token=req.cookies.auth.split(' ')[1]
                if (!token) {
                    return res.status(403).json({message: "User not authorized"})
                }
                const decoded=jwt.decode(token, process.env.secret)

                if(decoded.exp<new Date().getTime()/1000){
                    res.clearCookie("auth")
                    res.render("message",{user:res.user,auth:res.user,message:"Logout",timeout:300,where:"/home"})
                }
                else{
                    const user = jwt.verify(token, process.env.secret)
                    res.user= await User.findById(user.id)

                }

                next();
            } catch (e) {
                console.log(e)
                return res.status(403).json({message: "User not authorized"})
            }
        }
        else{
            res.user =null;
            next();
        }

    }
};