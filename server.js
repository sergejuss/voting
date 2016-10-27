'use strict';

var express = require('express'),
	routes = require('./app/routes/index.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
    session = require('express-session');
var app = express();
require('./app/config/passport')(passport);

mongoose.connect(process.env.Mongo_URI);

app.set('port', (process.env.PORT || 5000));

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
    secret: 'secretClementine',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));    
});

