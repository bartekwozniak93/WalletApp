// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');
var ValidToken = require('../controllers/validToken');
var ValidToken2 = require('../models/validToken');
var config = require('../config');
var nJwt = require('nJwt');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;



exports.login = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({ username: username }, function(err, user) {
        if (err) {
            res.send(err);
        }

        // No user found with that username
        if (!user) {
            res.send('err');
        }

        // Make sure the password is correct
        user.verifyPassword(password, function(err, isMatch) {
            if (err) {
                res.send('err');
            }

            // Password did not match
            if (!isMatch) {
                res.send('err');
            }

            var claims = {
                sub: user._id
            }


            var token = nJwt.create(claims, config.secret);
            token.setExpiration(new Date().getTime() + (config.expirationtime));
            ValidToken.postValidToken(token.compact(), user._id);
            res.json(token.compact());

        });
    });
};

// Create endpoint /api/users for POST
exports.logout = function(req, res) {
    ValidToken.deleteValidToken(req.headers.authorization.split(" ")[1]);
    res.json('logout');
};




passport.use(new BasicStrategy(
    function(username, password, callback) {
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                return callback(err);
            }

            // No user found with that username
            if (!user) {
                return callback(null, false);
            }

            // Make sure the password is correct
            user.verifyPassword(password, function(err, isMatch) {
                if (err) {
                    return callback(err);
                }

                // Password did not match
                if (!isMatch) {
                    return callback(null, false);
                }

                // Success
                return callback(null, user);
            });
        });
    }
));



var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = config.secret;
opts.strategy = ["HS256"];
opts.passReqToCallback = true;
passport.use(new JwtStrategy(opts, function(req, jwt_payload, done) {
    ValidToken2.findOne({ value: req.headers.authorization.split(" ")[1] }, function(err, validToken) {


        if (err) {
            return done(err, false);
        }
        if (validToken) {

            User.findOne({ _id: jwt_payload.sub }, function(err, user) {

                if (err) {
                    return done(err, false);
                }
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                    // or you could create a new account
                }
            });

        } else {
            done(null, false);
            // or you could create a new account
        }
    });



}));


exports.isAuthenticated = passport.authenticate('basic', { session: false });
exports.isJWTAuthenticated = passport.authenticate('jwt', { session: false });