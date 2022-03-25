const router = require('express').Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
var cookieParser = require('cookie-parser');
router.use(cookieParser());
const express = require('express');
const app = express();
const requests = require('../controllers/requests')
router
    .get("/", requests.getHome)
    .get("/en", requests.newUser)
    //.post("/join-group", requests.joinGroup)
    .post("/create-group", requests.newGroup)
    .get("/group/:id/:user/:newuser", requests.enterGroup)
    .post("/users", requests.getUsers)
    //.post("/message", requests.postMsg)
    .post("/getmsgs", requests.getMsgs, )

module.exports = router;