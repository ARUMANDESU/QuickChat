const User = require("../modules/User")
const Role = require("../modules/Role")
const bcrypt =require("bcryptjs")
const jwt =require("jsonwebtoken")
const cloudinary = require("cloudinary").v2;





class profileController{
    async personalAreaGet(req,res){

        try{
            const userIdName=req.params.id

            User.findOne({username:userIdName}).exec().then( async doc=>{
                res.render("personalArea",{
                    auth:res.user,
                    user:doc,
                    edit:false,
                    pcomments:[],
                })
            })


        }
        catch (e) {
            console.log(e);
            res.status(400).render("message",{auth:res.user,message:"Error",timeout:1000,where:`/home`})
        }
    }

    async personalAreaEditGet(req,res){
        try{
            res.render("personalArea",{
                auth:res.user,
                user:[],
                edit:true,
                pcomments:[],
            })
        }
        catch (e) {
            console.log(e);
            res.status(400).render("message",{auth:res.user,message:"Error",timeout:1000,where:`/user/${res.user.username}`})
        }
    }

    async personalAreaEditPost(req,res){
        try {
            const token=req.cookies.auth.split(' ')[1]
            if (!token) {
                return res.status(403).json({message: "User not authorized"})
            }
            const u = jwt.verify(token, process.env.secret)

            const user = await User.updateOne({_id:u.id},{
                phoneNumber:req.body.iphonenumber,
                address:req.body.iaddress,
                description:req.body.idescription,
                twitterUrl:req.body.itwitterUrl,
                instagramUrl:req.body.iinstagramUrl,
                facebookUrl:req.body.ifacebookUrl
            })
            res.render("message",{auth:res.user,message:"changed",timeout:100,where:`/user/profile/${res.user.username}`})
        }
        catch (e) {
            console.log(e);
            res.status(400).render("message",{auth:res.user,message:"Error",timeout:2000,where:`/user/edit`})
        }
    }

    async personalAreaEditAvaGet(req,res){
        try{
            res.render("changeAva",{
                auth:res.user,
            })
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message:"Error"})
        }
    }

    async personalAreaEditAvaPost(req,res){
        try {
            //cloudinary api
            cloudinary.config({
                cloud_name:process.env.cloudinary_cloud_name,
                api_key:process.env.cloudinary_api_key,
                api_secret:process.env.cloudinary_api_secret
            })
            const token=req.cookies.auth.split(' ')[1]
            if (!token) {
                return res.status(403).json({message: "User not authorized"})
            }
            const u = jwt.verify(token, process.env.secret)
            const oldAvatar=res.user.avatarUrl.split("/")
            // if(oldAvatar!="https://res.cloudinary.com/nezz/image/upload/v1651755541/avatars/ecce-homo_j36lz7.jpg"){
            //     const public_id=`${oldAvatar[7]+"/"+oldAvatar[8].slice(0,20)}`
            //     const deleteResult= await  cloudinary.uploader.destroy(`${public_id}`);
            // }
            const result = await cloudinary.uploader.upload(req.file.path,{folder:"avatars",transformation: [{width: 250, height: 250, crop: "thumb"}]});
            const user = await User.updateOne({_id:u.id},{
                avatarUrl:result.secure_url,
            })
            res.render("message",{auth:res.user,message:"changed",timeout:100,where:`/user/profile/${res.user.username}`})
        }
        catch (e) {
            console.log(e);
            res.status(400).render("message",{auth:res.user,message:"Error",timeout:2000,where:`/user/edit`})
        }
    }
    async deleteUser(req,res){
        try{
            const deleteUser = await User.findOneAndDelete({username:req.params.user})
            res.status(400).render("message",{auth:res.user,message:"Removed",timeout:1000,where:`/users/1`})

        }
        catch (e) {
            console.log(e);
            res.status(400).render("message",{auth:res.user,message:"Error",timeout:2000,where:`/user/edit`})
        }
    }
    async assignRole(req,res){
        try{
            const username=req.params.user
            const roleToAssign =req.params.role
            if(roleToAssign=="admin"){
                await User.findOneAndUpdate({username:username},{roles:['USER','ADMIN']})
            }
            else if(roleToAssign=="user"){
                await User.findOneAndUpdate({username:username},{roles:['USER']})
            }

            res.status(400).render("message",{auth:res.user,message:"Changed",timeout:1000,where:`/users/1`})

        }
        catch (e) {
            console.log(e);
            res.status(400).render("message",{auth:res.user,message:"Error",timeout:2000,where:`/user/edit`})
        }
    }
}
module.exports =new profileController();