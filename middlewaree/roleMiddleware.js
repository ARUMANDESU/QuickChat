const jwt = require('jsonwebtoken')



module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }

        try {
            const token=req.cookies.auth.split(' ')[1]
            if (!token) {
                return res.status(403).render("message",{user:res.user,auth:res.user,message:"User not authorized",timeout:800,where:"/login"})
            }
            const user = jwt.verify(token, process.env.secret)
            let hasRole = false
            user.role.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true
                }
            })
            if (!hasRole) {
                return res.status(403).render("message",{user:res.user,auth:res.user,message:"You don't have access",timeout:800,where:"/home"})
            }
            next();
        } catch (e) {
            console.log(e)
            return res.status(403).render("message",{user:res.user,auth:res.user,message:"User not authorized",timeout:800,where:"/login"})
        }
    }
};