const express = require('express');
const bodyParser = require("body-parser");
const app = express()

const port = 3000

//using images from "images" folder
app.use("/public",express.static(__dirname + '/public'));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) =>{
    res.redirect("/home")
})
app.get("/home",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})
app.get("/about",(req,res)=>{
    res.sendFile(__dirname+"/about.html")
})
app.get("/chat",(req,res)=>{
    res.sendFile(__dirname+"/chat.html")
})




app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use((req,res)=>{
    res.sendFile(__dirname+"/error.html")
})