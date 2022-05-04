const jwt = require('jsonwebtoken')
const {secret} = require('../config')
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
                const user = jwt.verify(token, secret)
                res.user= await User.findById(user.id)
                next();
            } catch (e) {
                console.log(e)
                return res.status(403).json({message: "User not authorized"})
            }
        }
        else{
            next();
        }

    }
};