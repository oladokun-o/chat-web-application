const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const http = require('http')
var createError = require('http-errors');
//const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const compression = require('compression');
const db = require('../config/index').get(process.env.NODE_ENV);
const cors = require('cors')
var app = express();
app.use(cors())
app.use(compression());

//routes 
const indexRouter = require("../routes/index")
const Group = require('../models/creategroup')
app.use("/", indexRouter);



//mongo connection
require("../config/mongo")

//set port
var port = db.PORT;

// view engine setup
app.set('views', 'views');
app.set('view engine', 'pug');
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'))
app.use(express.static('node_modules/bootstrap/dist/css/'));
app.use(express.static('node_modules/bootstrap/dist/js/'));
app.use(express.static('node_modules/@popperjs/core/dist/cjs/'));
app.use(express.static('node_modules/jquery/dist'));
app.use(express.static('node_modules/@popperjs/core/dist/cjs'));
app.use(express.static('../node_modules/jquery-ui/ui/effects/'));
app.use(express.static('node_modules/hamburgers/dist'));
app.use(express.static('node_modules/@fortawesome/fontawesome-free/css/'));
app.use(express.static('node_modules/@fortawesome/fontawesome-free/webfonts/'));
app.use(express.static('node_modules/@fortawesome/fontawesome-free/js//'));
app.use(express.static('node_modules/socket.io/client-dist/'));

 // catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: 'Error!' });
    console.log(err)
});
/** Create HTTP server. */
const server = http.createServer(app);

/** Listen on provided port, on all network interfaces. */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
//Start Server
server.on("listening", () => {
    console.log(`Chat application is listening on port::${port} |`, `http://localhost:${port}`)
});

const { Server } = require("socket.io");
const io = new Server(server);

indexRouter.post('/message', (req, res) => {
    var newmessage = {
        msg: {
            user: req.body.user,
            message: req.body.message,
            time: req.body.time 
        }   
    }
    
    Group.findOne({ _id:  req.body.group}, function (err, group) {
        if (group) {
            group.messages.push(newmessage.msg);
            group.save((err, done) => {
                if (err) return res.status(500).send('error occurred saving message')

                res.status(200).send({stat: true})              
                let po = {
                    group: req.body.group,
                    msg: newmessage.msg
                }                                 
                io.emit('message', po)
            });
        } else if (err) return res.status(500).send('Could not send message, try again')
    })
})

indexRouter.post("/join-group", (req, res) => {
    let newuser = req.body.username;
    newuser = newuser.toLowerCase();
    Group.findOne({ _id:  req.body.group_id}, function (err, group) {
        if (err) {                
            console.log(err)
            return res.status(500).send('An error occurred')
        } else if (group) {                
            Group.findOne({users: req.body.username}, function(err, user) {
                if (!user) {                    
                    group.users.push(newuser);
                    group.save((err, done) => {
                        if (err) return res.status(500).send('Could not add you to group, try again')

                        res.status(200).send({exist: false, username: req.body.username, group_name: group.group_name, group_no: group.users.length, groupId: group._id, msg:'You have been added to '+group.group_name})
                    });
                } else if (user) {
                    res.status(500).send({exist: true, username: req.body.username, group_name: group.group_name, group_no: group.users.length, groupId: group._id, errMsg:'Username already used in group!'})
                }                
            })      
        } else if (!group) return res.status(500).render('entry', {errMsg: 'Group doesn"t exist!'})
    })
})

indexRouter.post("/ping", (req, res) => {
    res.status(200).send('OK')
    io.emit('join', req.body)
})

io.on('connection', socket => {
    console.log(io.engine.clientsCount + ' user connected')

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    })
})

module.exports = {
    app
};