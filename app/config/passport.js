'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

	passport.use(new GitHubStrategy({
        clientID: configAuth.githubAuth.clientID,
        clientSecret: configAuth.githubAuth.clientSecret,
        callbackURL: configAuth.githubAuth.callbackURL
	},
	function (token, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({ 'profile.id': profile.id, 'profile.provider': 'github' }, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    return done(null, user);
                } else {
                	var newUser = new User();

                    newUser.profile.id = profile.id;                    
                    newUser.profile.displayName = profile.displayName;                    
                    newUser.profile.provider = 'github';                    

                    newUser.save(function (err) {
                        if (err) {
                            throw err;
                        }

                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL
    },
    function (token, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({ 'profile.id': profile.id, 'profile.provider': 'facebook' }, function (err, user) {
                if (err) {
                    return done(err);
                }
                
                if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();

                    newUser.profile.id = profile.id;                    
                    newUser.profile.displayName = profile.displayName; 
                    newUser.profile.provider = 'facebook';                                       

                    newUser.save(function (err) {
                        if (err) {
                            throw err;
                        }

                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    },
    function (token, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({ 'profile.id': profile.id, 'profile.provider': 'google' }, function (err, user) {
                if (err) {
                    return done(err);
                }
                
                if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();

                    newUser.profile.id = profile.id;                    
                    newUser.profile.displayName = profile.displayName; 
                    newUser.profile.provider = 'google';                                       

                    newUser.save(function (err) {
                        if (err) {
                            throw err;
                        }

                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};