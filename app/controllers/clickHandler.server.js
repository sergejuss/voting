'use strict';

var Users = require('../models/users.js');

function clickHandler () {    

    this.getPolls = function (req, res) {        
        Users
            .find({}, { '_id': false })
            .exec(function (err, result) {
                if (err) { console.log(err); } else {
                    var polls = [];
                    for (var i=0; i<result.length; i++) {
                        for (var j=0; j<result[i]['polls'].length; j++) {
                            polls.push({id: result[i]['polls'][j]['_id'], title: result[i]['polls'][j]['title']});
                        }
                    }
                    res.json(polls);
                }
            });        
    };

    this.getMyPolls = function (req, res) {        
        Users
            .find({ 'profile.id': req.user.profile.id, 'profile.provider': req.user.profile.provider }, { '_id': false })
            .exec(function (err, result) {
                if (err) { console.log(err); } else {
                    res.json(result);
                }                
            });        
    };

    this.getPoll = function (req, res) {        
        Users
            .findOne({'polls._id': req.params.pollId})
            .exec(function (err, result) {
                if (err) { console.log(err); } else {
                    for (var i=0; i<result.polls.length; i++) {                    
                        if (result.polls[i]['_id'].toString() === req.params.pollId) {
                            var poll = result.polls[i];                        
                        }                    
                    }
                    res.json(poll);                    
                }
            }); 
    };

    this.deletePoll = function (req, res) {        
        Users
            .findOne({'polls._id': req.params.pollId})
            .exec(function (err, result) {
                if (err) { console.log(err); } else {
                    for (var i=0; i<result.polls.length; i++) {                    
                        if (result.polls[i]['_id'].toString() === req.params.pollId) {
                            result.polls[i].remove();                        
                        }                    
                    } 
                    result.save(function (err) {
                        if (err) { console.log(err); }
                        getMyPolls();
                    }); 
                }
            }); 
        
        function getMyPolls () {
            Users
                .find({ 'profile.id': req.user.profile.id, 'profile.provider': req.user.profile.provider }, { '_id': false })
                .exec(function (err, result) {
                    if (err) { console.log(err); } else {
                        res.json(result);
                    }                
            });
        }
    };
    
    this.vote = function (req, res) {         
        Users
            .findOne({'polls._id': req.body.pollId})
            .exec(function (err, result) {
                if (err) { console.log(err); } else {
                    for (var i=0; i<result.polls.length; i++) {                    
                        if (result.polls[i]['_id'].toString() === req.body.pollId) {
                            var poll = result.polls[i];                        
                        }
                    } 
                    var message = '';
                    if(req.user) {
                        if (poll.voted.user_id.indexOf(req.user.profile.id) === -1) {                            
                            poll.options[req.body.option]['votes'] += 1;
                            poll.voted.user_id.push(req.user.profile.id);
                            message = 'You voted for ' + poll.options[req.body.option]['title'] + '.';
                        } else {
                            message = 'You can only vote once.';
                        }              
                    }  else if (poll.voted.ip.indexOf(req.ip) === -1) {                        
                        poll.options[req.body.option]['votes'] += 1;
                        poll.voted.ip.push(req.ip);
                        message = 'You voted for ' + poll.options[req.body.option]['title'] + '.';
                    }  else {                        
                        message = 'You can only vote once.';
                    }                   
                    
                    result.save(function (err) {
                        if (err) { console.log(err); }
                        getPoll(message);
                    });                                                  
                }
            }); 
        function getPoll (message) {            
            Users
            .findOne({'polls._id': req.body.pollId})
            .exec(function (err, result) {
                if (err) { console.log(err); } else {
                    for (var i=0; i<result.polls.length; i++) {                    
                        if (result.polls[i]['_id'].toString() === req.body.pollId) {
                            var poll = result.polls[i];                        
                        }                    
                    }
                    var pollReturn = {};
                    pollReturn.title = poll.title;
                    pollReturn._id = poll._id;
                    pollReturn.options = poll.options;
                    pollReturn.message = message;                    
                    
                    res.json(pollReturn);                    
                }
            }); 
        }
    };

    this.addPoll = function (req, res) {
        var options_raw = req.body.options.split('\n');
        var options_trim = options_raw.map(function(e){            
            return e.trim();            
        }); 
        var options = options_trim.filter(function(e){
            return e.length > 0;
        });
        Users
            .findOneAndUpdate({ 'profile.id': req.user.profile.id, 'profile.provider': req.user.profile.provider }, 
            { $push: { 'polls': {'title': req.body.title }}}, {'new': true})
            .exec(function (err, result) {
                if (err) { console.log(err); } else {
                    for (var i in options) {
                        result.polls[result.polls.length-1].options.push({'title': options[i], 'votes': 0});
                    }                
                    result.save(function (err) {
                        if (err) { console.log(err); }
                    });
                    res.redirect('/userpolls');
                }
            });
        
    };
}

module.exports = clickHandler;