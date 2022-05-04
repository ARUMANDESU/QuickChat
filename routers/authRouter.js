const express = require('express');
const router = express()
const User = require("../modules/User")
const Role = require("../modules/Role")
const controller =require("./authController")
const {check, checkSchema} = require("express-validator")
const authMiddleware = require("../middlewaree/authMiddleware")
const roleMiddleware= require("../middlewaree/roleMiddleware")
const auth =require("../middlewaree/auth")
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const {secret} = require('../config')
const https = require("https");

router.use(cookieParser())

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));


router
    .get('/login',auth() , (req, res) => {
        const avatar= res.user ? res.user.avatarUrl:""
    res.render("login",{auth:res.user,avatar:avatar})

    })
    .post('/login', controller.login)

router
    .get('/register',auth(), (req, res) => {
        const avatar= res.user ? res.user.avatarUrl:""
    res.render("register",{auth:res.user,avatar:avatar})
    })
    .post('/register', [
        check('username',"Username cannot be empty").notEmpty(),
        check('password',"Password must be more than 7 and less than 15 symbols").isLength({min:7,max:15})
    ],controller.register)

router
    .get("/users"  ,controller.getUsers);

router.get('/', (req, res) =>{
    res.redirect("/home")
})
router.get("/home",auth(),(req,res)=>{
    const avatar= res.user ? res.user.avatarUrl:""
    res.render("index",{auth:res.user,avatar:avatar})
})
router.get("/about",auth(),(req,res)=>{
    const avatar= res.user ? res.user.avatarUrl:""
    // unsplash api

    const api_key='9ikFXSSzfgU68HWrQ5PF_08eQNUUzwi-KduO5MLDv1M' //get from unsplash developers
    const url=`https://api.unsplash.com/photos/random/?client_id=${api_key}`;
    https.get(url,(response)=>{
        console.log(response.statusCode);
        response.setEncoding('utf8');
        // without this part of code response don't give us whole json file (found this solution from internet)
        let body = '';
        response.on('data', (d) => {
            body += d;
        });

        response.on('end', () => {
            let parsedImg = JSON.parse(body);

            res.render('about',{randomImg:parsedImg.urls.regular,auth:res.user,avatar:avatar})

        })
    })
})
router.get("/chat",auth(),(req,res)=>{
    const avatar= res.user ? res.user.avatarUrl:""
    res.render("chat",{parsed:[],auth:res.user,avatar:avatar})
})


router.post("/chat",auth(),(req,res)=>{
    const avatar= res.user ? res.user.avatarUrl:""
    const api_key='FjcUNrdCq0IX06NM4o3M8iWJoVs2FZhC' //get from giphy developers
    const name = req.body.gifname;

    const url='https://api.giphy.com/v1/gifs/search?api_key='+api_key+'&limit=5&q='+name;

    https.get(url,(response)=>{
        console.log(response.statusCode);
        response.setEncoding('utf8');
        // without this part of code response don't give us whole json file (found this solution from internet)
        let body = '';
        response.on('data', (d) => {
            body += d;
        });

        response.on('end', () => {
            let parsed = JSON.parse(body);

            res.render('chat',{parsed:parsed.data,auth:res.user,avatar:avatar})

        })
    })
})
router.get('/user/profile/:id',auth(),async (req, res) => {
    res.render("personalArea",{
        avatar:res.user.avatarUrl,
        auth:res.user,
        edit:false,
        pavatarUrl:res.user.avatarUrl,
        pusername:res.user.username,
        pfullname:res.user.fullname,
        pphoneNumber:res.user.phoneNumber,
        paddress:res.user.address,
        pemail:res.user.email,
        pdescription:res.user.description,
        ptwitterUrl:res.user.twitterUrl,
        pinstagramUrl:res.user.instagramUrl,
        pfacebookUrl:res.user.facebookUrl,
        pcomments:[],
    })




})
router
    .get('/user/edit',auth(),(req, res) => {
        const avatar= res.user ? res.user.avatarUrl:""
        res.render("personalArea",{
            avatar:res.user.avatarUrl,
            auth:res.user,
            edit:true,
            pavatarUrl:res.user.avatarUrl,
            pusername:res.user.username,
            pfullname:res.user.fullname,
            pphoneNumber:res.user.phoneNumber,
            paddress:res.user.address,
            pemail:res.user.email,
            pdescription:res.user.description,
            ptwitterUrl:res.user.twitterUrl,
            pinstagramUrl:res.user.instagramUrl,
            pfacebookUrl:res.user.facebookUrl,
            pcomments:[],
        })
    })
    .post('/user/edit',auth(),async (req, res) => {
        const token=req.cookies.auth.split(' ')[1]
        if (!token) {
            return res.status(403).json({message: "User not authorized"})
        }
        const u = jwt.verify(token, secret)
        const user = await User.updateOne({_id:u.id},{
            phoneNumber:req.body.iphonenumber,
            address:req.body.iaddress,
            description:req.body.idescription,
            twitterUrl:req.body.itwitterUrl,
            instagramUrl:req.body.iinstagramUrl,
            facebookUrl:req.body.ifacebookUrl
        })
        await res.render("personalArea",{
            avatar:res.user.avatarUrl,
            auth:res.user,
            edit:false,
            pavatarUrl:res.user.avatarUrl,
            pusername:res.user.username,
            pfullname:res.user.fullname,
            pphoneNumber:res.user.phoneNumber,
            paddress:res.user.address,
            pemail:res.user.email,
            pdescription:res.user.description,
            ptwitterUrl:res.user.twitterUrl,
            pinstagramUrl:res.user.instagramUrl,
            pfacebookUrl:res.user.facebookUrl,
            pcomments:[],
        })
    })


module.exports= router;