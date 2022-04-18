const express = require('express');
const https =require("https");
const bodyParser = require("body-parser");
const path  = require('path');
const app = express();
const port = 3000;

app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs')


app.use("/public",express.static(__dirname + '/public'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) =>{
    res.redirect("/home")
})
app.get("/home",(req,res)=>{
    res.render("index")
})
app.get("/about",(req,res)=>{
    res.render("about")
})
app.get("/chat",(req,res)=>{
    res.render("chat",{parsed:[]})
})


app.post("/chat",(req,res)=>{
    const api_key='FjcUNrdCq0IX06NM4o3M8iWJoVs2FZhC' //get from giphy developers
    const name = req.body.gifname;

    const url='https://api.giphy.com/v1/gifs/search?api_key='+api_key+'&limit=5&q='+name;
    
    https.get(url,(response)=>{
        console.log(response.statusCode);

        //
        response.setEncoding('utf8');
        let body = '';
        response.on('data', (d) => {
            
             body += d;
        });
       
        response.on('end', () => {
            let parsed = JSON.parse(body);
            
            res.render('chat',{parsed:parsed.data})

        })
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use((req,res)=>{
    res.render("error")
})