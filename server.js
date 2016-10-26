'use strict';

var express = require('express'),
	routes = require('./app/routes/index.js'),
	mongoose = require('mongoose');
var app = express();

mongoose.connect(process.env.Mongo_URI);

app.set('port', (process.env.PORT || 5000));

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

routes(app);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));    
});

