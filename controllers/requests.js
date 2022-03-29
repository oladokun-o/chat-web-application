const Group = require('../models/creategroup')
const User = require('../models/user')
module.exports = {
    getHome: async (req, res) => {
        res.render('entry', {
            title: 'Chat Web App',
            app: 'home'
        });
    },
    newUser: async (req, res) => {
        res.render('entry', {
            title: 'Chat Web App'
        });
    },
    newGroup: async (req, res) => {     
        const newgroup = new Group({
            group_name: req.body.group_name,
            users: req.body.users,
            chatInitiator: req.body.username,
            messages: []
        });

        var newGroupName = newgroup.group_name, newGroupInitiator = newgroup.username;

        Group.findOne({ group_name:  newGroupName}, function (err, group) {
            if (group) return res.status(500).send('Group name taken!')
            else if (!group) {                
                newgroup.save((err, group) => {
                    if (err) {
                        console.log(err); 
                        return res.status(500).send(err._message)
                    }
    
                    res.status(200).send({id: group._id, msg: 'Group Created!', user: req.body.username})
                })
            } else if (err) {
                console.log(err)
                return res.status(500).send('An error occurred')
            }
        })    
    },/*
    joinGroup: async (req, res) => {
        Group.findOne({ _id:  req.body.group_id}, function (err, group) {
            if (err) {                
                console.log(err)
                return res.status(500).send('An error occurred')
            } else if (group) {                
                Group.findOne({users: req.body.username}, function(err, user) {
                    if (!user) {
                        console.log(group)
                        group.users.push(req.body.username);
                        group.save((err, done) => {
                            if (err) return res.status(500).send('Could not add you to group, try again')

                            res.status(200).send({username: req.body.username, group_name: group.group_name, group_no: group.users.length, groupId: group._id, msg:'You have been added to '+group.group_name})
                        });
                    } else if (user) {
                        res.status(500).send({exist: true, username: req.body.username, group_name: group.group_name, group_no: group.users.length, groupId: group._id, errMsg:'Username already used in group!'})
                    }                
                })      
            } else if (!group) return res.status(500).render('entry', {errMsg: 'Group doesn"t exist!'})
        })
    },*/
    enterGroup: async (req, res) => {
        Group.findOne({ _id:  req.params.id}, function (err, group) {
            if (err) {                
                console.log(err)
                return res.status(500).send('An error occurred')
            } else if (!group) {
                return res.status(500).render('entry', {errMsg: 'Group doesn"t exist!'})
            } else if (group) {
                Group.findOne({users: req.params.user.toLowerCase()}, function(err, user) {
                    if (user) {
                        res.render('index', {
                            title: group.group_name.toUpperCase(),
                            groupAdmin: group.chatInitiator,
                            id: group._id,
                            groupName: group.group_name,
                            app: 'entry',
                            user: req.params.user,
                            messages: group.messages,
                            newuser: req.params.newuser
                        }) 
                    } else if (!user) {
                        return res.status(500).render('entry', {errMsg: 'User doesn"t exist!'})
                    }
                })  
            }                
        })
    },
    getUsers: async (req, res) => {
        Group.findOne({ _id:  req.body.id}, function (err, group) {
            if (err) {                
                console.log(err)
                return res.status(500).render('entry', {errMsg: 'Couldn"t get users!'})
            }
            
            //get users
            res.send(group);        
        })
    },
    /*postMsg:  async (req, res) => {        
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

                });
            } else if (err) return res.status(500).send('Could not send message, try again')
        })
    },*/
    getMsgs:  async (req, res) => {
        Group.find({_id: req.body.id}, function (err, group) {
            if (group) {
                res.status(200).send(group);
            } else if (err) return res.status(500).send('Could not get messages, try again')
        })
    }
}