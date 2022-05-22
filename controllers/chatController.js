const User = require("../modules/User");


class chatController{
    async chat(req,res){
        const userto={
            _id:"1 ",
            username:"testing place",
            email:'test',
            avatarUrl:' ',
            roles:['USER']
        }
        res.render('chat',{auth:res.user,user:userto})
    }
    async chatusername(req,res){
        const username = req.params.username
        const userto= await User.findOne({username:username})
        res.render('chat',{auth:res.user,user:userto})
    }
}

module.exports = new chatController