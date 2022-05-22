const express = require('express')
const router = express()
const authMiddleware = require("../middlewaree/authMiddleware")
const roleMiddleware= require("../middlewaree/roleMiddleware")
const auth =require("../middlewaree/auth")
const apiController = require('../controllers/apiController')
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')

router.use(cookieParser())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));

router
    .get("/users",apiController.getAllUsers)
    .get("/getRandomUser",apiController.getRandomUser)

module.exports= router;