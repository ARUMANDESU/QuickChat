const User = require("../modules/User")

class ApiController {
    async getAllUsers(req,res){
        const users = await User.find()
        res.status(200).json({users:users})
    }
    async getRandomUser(req,res){
        const user =await User.find()
        res.status(200).json({user:user[Math.round( Math.random()*user.length)]})
    }
}

module.exports = new ApiController()