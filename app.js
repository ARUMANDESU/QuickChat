const express = require('express');
const https =require("https");
const bodyParser = require("body-parser");
const path  = require('path');
const mongoose = require('mongoose');
const auth = require("./middlewaree/auth");
const Router = require("./routers/router")
const MyAPI = require("./routers/apiRouter")
const swaggerUi = require('swagger-ui-express'), swaggerDocument = require('./swagger.json');
const dotenv =require("dotenv")
const authGoogle = require('./authGoogle')
const passport = require('passport');
const session = require("express-session");
dotenv.config()
const app = express();
const port = process.env.PORT||3000;

app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs')

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.use("/public",express.static(__dirname + '/public'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/",Router)
app.use("/api",MyAPI)
app.use(session({secret:"cats"}));
app.use(passport.initialize());
app.use(passport.session());

mongoose
    .connect(process.env.db)
    .then((res) => console.log('Connected to DB'))
    .catch(error => console.log(error))
app.get('/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}))

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/db',
        failureRedirect: '/error'
    })
)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use(auth(),(req,res)=>{
    res.render("error",{auth:res.user})
})