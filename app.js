const express = require('express');
const https =require("https");
const bodyParser = require("body-parser");
const path  = require('path');
const mongoose = require('mongoose');
const auth = require("./middlewaree/auth");
const Router = require("./routers/router")
const dotenv =require("dotenv")
dotenv.config()
const app = express();
const port = process.env.PORT||3000;

app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs')


app.use("/public",express.static(__dirname + '/public'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/",Router)

mongoose
    .connect(process.env.db)
    .then((res) => console.log('Connected to DB'))
    .catch(error => console.log(error))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use(auth(),(req,res)=>{
    res.render("error",{auth:res.user})
})