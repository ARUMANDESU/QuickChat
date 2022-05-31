const User = require("../modules/User")
const Role = require("../modules/Role")
const bcrypt =require("bcryptjs")
const jwt =require("jsonwebtoken")
const {validationResult} =require("express-validator");

const randomPass = () => {
    let a = Math.round(Math.random() * 11);
    let passw = a % 3 == 0 ? Math.round(Math.random() * 9) :
        a % 3 == 1 ? String.fromCharCode(Math.round(Math.random() * (90 - 65) + 65)) :
            String.fromCharCode(Math.round(Math.random() * (122 - 97) + 97));

    for (let i = 0; i < 20; i++) {
        if(Math.round(Math.random() * 11) % 2 == 0) {
            passw += Math.round(Math.random() * 9);
        }
        else {
            if(Math.round(Math.random() * 11) % 2 == 0) {
                passw += String.fromCharCode(Math.round(Math.random() * (90 - 65) + 65));
            }
            else {
                passw += String.fromCharCode(Math.round(Math.random() * (122 - 97) + 97));
            }
        }
    }
    return passw;
}

const generateAccessToken = (id,role)=>{
    const payload={
        id,
        role
    }
    return jwt.sign(payload,process.env.secret,{expiresIn:"24h"})
}

class authController{
    async register(req, res){
        try{



            const email =  req.body.email;
            const username = req.body.username;
            const password =   req.body.password;
            
            const errors =validationResult(req);
            if(!errors){
                return res.status(400).render("message",{auth:res.user,message:"errors",timeout:1000,where:"/register"})
            }
            

            let candidate =await User.findOne({username})
            if(candidate){
                return await res.render("message",{auth:res.user,avatar:"",message:"Username already exists",timeout:1000,where:"/register"})
            }
            candidate = await User.findOne({email:email})
            if(candidate){
                return await res.render("message",{auth:res.user,avatar:"",message:"User with this email already exists",timeout:1000,where:"/register"})
            }
            const hashPassword = bcrypt.hashSync(password,7);
            const userRole = await Role.findOne({value:"USER"});
            const user = new User({email,username,password:hashPassword,roles:[userRole.value],avatarUrl:"https://res.cloudinary.com/nezz/image/upload/v1651755541/avatars/ecce-homo_j36lz7.jpg",phoneNumber:"",address:"",twitterUrl:"",instagramUrl:"",facebookUrl:""});
            await user.save();
            return await  res.render("message",{auth:res.user,message:"The user has been successfully registered",timeout:1000,where:"/login"})
            
        }catch(e){
            console.log(e);
            res.status(400).render("message",{auth:res.user,message:"Registration error",timeout:1000,where:"/register"})
        }
    }
    async gLogin(req, res) {
        try {
            const email = await req.user.email;
            const username = await req.user.displayName;
            let user = await User.findOne({email})
            if(!user) {
                const userRole = await Role.findOne({value: "USER"})
                const hashPassword = bcrypt.hashSync(randomPass(),7);
                user = new User({email,username,password:hashPassword,roles:[userRole.value],avatarUrl:`${req.user.photos[0].value}`,phoneNumber:"",address:"",twitterUrl:"",instagramUrl:"",facebookUrl:""});
                await user.save();
            }
            const token =generateAccessToken(user._id,user.roles);
            res.cookie("auth",'Bearer '+ token)
            res.render("message",{auth:res.user,message:"You successfully logged in",timeout:500,where:"/home"})

        } catch(e) {
            console.log(e);
            res.status(400).render("message",{auth:res.user,message:"Login error",timeout:700,where:"/login"})

        }
    }

    async login(req, res){
        try{
            const username= req.body.username;
            const password= req.body.password;
            
            const user =await User.findOne({username});
            if(!user){
                return res.status(400).render("message",{auth:res.user,message:`User ${username} not found`,timeout:1500,where:"/login"})
            }
            const validPassword = bcrypt.compareSync(password,user.password)
            if(!validPassword){
                return res.status(400).render("message",{auth:res.user,message:"Wrong password",timeout:1000,where:"/login"})
            }
            const token =generateAccessToken(user._id,user.roles);
            res.cookie("auth",'Bearer '+ token)
            res.render("message",{auth:res.user,message:"You successfully logged in",timeout:500,where:"/home"})

        }catch(e){
            console.log(e);
            res.status(400).render("message",{auth:res.user,message:"Login error",timeout:700,where:"/login"})
        }
    }
    
    async getUsers(req, res){
        try{

            const user= await User.find().sort({roles:1})
            const pageNum=req.params.page
            const start=(pageNum-1)*20
            const end= user.length
            res.render("users",{
                auth:res.user,
                users:user,
                start:start,
                end:end,
                page:pageNum,
            })
            // const userRole =new Role()
            // const adminRole =new Role({value:"ADMIN"})
            // await userRole.save()
            // await adminRole.save()
        }catch(e){

        }
    }

    async logOut(req,res){
        try {
            res.clearCookie("auth")
            res.render("message",{user:res.user,auth:res.user,message:"Logout",timeout:300,where:"/home"})
        } catch (e) {
            console.log(e)
            return res.status(403).render("message",{user:res.user,auth:res.user,message:"Logout errors",timeout:1500,where:"/home"})
        }
    }
}

module.exports =new authController();