const User = require("../modules/User")
const Role = require("../modules/Role")
const bcrypt =require("bcryptjs")
const jwt =require("jsonwebtoken")
const {query} = require("express-validator");
const cloudinary = require("cloudinary").v2;
const formidable = require("formidable")
const https = require("https");


class catalogController{
    async home(req,res){
        try {

            res.render("index",{auth:res.user})
        }
        catch (e) {
            console.log(e);
            res.status(400).render("message",{auth:res.user,message:"Error",timeout:100000,where:""})
        }
    }
    async About(req,res){
        try{
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

                    res.render('about',{randomImg:parsedImg.urls.raw,auth:res.user})

                })
            })
        }
        catch (e) {
            console.log(e);
            res.status(400).render("message",{auth:res.user,message:"Error",timeout:2000,where:"/home"})
        }
    }

    async Chat(req,res){
        try {
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

                    res.render('chat',{parsed:parsed.data,auth:res.user})

                })
            })
        }
        catch (e) {
            console.log(e);
            res.status(400).render("message",{auth:res.user,message:"Error",timeout:2000,where:"/home"})
        }
    }

}

module.exports= new catalogController();