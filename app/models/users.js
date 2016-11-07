'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = new Schema({
  id: Schema.Types.ObjectId,
  title: String,
  voted: {
    user_id: [String],
    ip: [String]
  },
  options: [{
    title: String,
    votes: Number
  }]
});

var User = new Schema({
    profile: {
      id: String,
      displayName: String,      
    	provider: String
    },
    polls: [pollSchema]
});

module.exports = mongoose.model('User', User);