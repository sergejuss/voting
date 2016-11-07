'use strict';

var path = process.cwd();

var ClickHandler = require(process.cwd() + '/app/controllers/clickHandler.server.js');
var multer = require('multer'); 
var upload = multer(); 
var bodyParser = require('body-parser');


module.exports = function (app, passport) {

    function isLoggedIn (req, res, next) {
	    if (req.isAuthenticated()) {
	        return next();
	    } else {
	        res.redirect('/polls');
	    }
    }

    function pollIsLoggedIn (req, res, next) {
	    if (req.isAuthenticated()) {
	        return next();
	    } else {            
	        res.sendFile(path + '/public/poll.html');
	    }
    }

	var clickHandler = new ClickHandler();

    app.route('/')
        .get(isLoggedIn, function (req, res) {
            res.sendFile(process.cwd() + '/public/userpolls.html');
        });

    app.route('/polls')
    	.get(function (req, res) {
        	res.sendFile(path + '/public/index.html');
    	});

    app.route('/userpolls') 
    	.get(isLoggedIn, function (req, res) {
        	res.sendFile(path + '/public/userpolls.html');
    	});

	app.route('/my_polls')
    	.get(isLoggedIn, function (req, res) {
        	res.sendFile(path + '/public/my_polls.html');
    	});    

    app.route('/poll/:poll')
    	.get(pollIsLoggedIn, function (req, res) {            
        	res.sendFile(path + '/public/userpoll.html');
    	});

    app.route('/poll/vote')
    	.post(bodyParser.urlencoded({ extended: true }), clickHandler.vote);

   	app.route('/logout')
	    .get(function (req, res) {
	        req.logout();
	        res.redirect('/polls');
    	});

    app.route('/new_poll')
	    .get(isLoggedIn, function (req, res) {
	        res.sendFile(path + '/public/new_poll.html');
    	});	

    app.route('/api/polls')
        .get(clickHandler.getPolls)
        .post(isLoggedIn, upload.none(), clickHandler.addPoll);

    app.route('/api/poll/:pollId')
	    .get(clickHandler.getPoll)
        .delete(clickHandler.deletePoll);    

	app.route('/api/my_polls')
        .get(isLoggedIn, clickHandler.getMyPolls);      

	app.route('/auth/github')
    	.get(passport.authenticate('github'));

    app.route('/auth/github/callback')
	    .get(passport.authenticate('github', {
	        successRedirect: '/userpolls',
	        failureRedirect: '/'	        
	    }));

	app.route('/auth/facebook')
    	.get(passport.authenticate('facebook'));

    app.route('/auth/facebook/callback')
	    .get(passport.authenticate('facebook', {
	        successRedirect: '/userpolls',
	        failureRedirect: '/'	        
	    }));

	app.route('/auth/google')
    	.get(passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

    app.route('/auth/google/callback')
	    .get(passport.authenticate('google', {
	        successRedirect: '/userpolls',
	        failureRedirect: '/'	        
	    }));

    
        
};