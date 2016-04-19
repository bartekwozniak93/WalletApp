var passport = require('passport');
var User = require('../models/user');
var ValidToken = require('../controllers/validToken');
var ValidTokenBase = require('../models/validToken');
var config = require('../config');
var nJwt = require('nJwt');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var FacebookStrategy = require('passport-facebook').Strategy;
var sync = require('synchronize');


exports.authenticateLocal = function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    if (email === undefined  || password === undefined ) {
        res.end('Login or password cannot be empty.');
    } else {
        User.findOne({ 'local.email': email }, function(err, user) {
            if (err) {
                res.send(err);
            }
            if (!user) {
                return res.json('Login or password is incorrect.');
            } else {
                var localUser = user.local;
                localUser.verifyPassword(password, function(err, isMatch) {
                    if (err) {
                        res.send(err);
                    }
                    if (!isMatch) {
                        return res.json('Login or password is incorrect.');
                    }
                    req.user = user;
                    next();
                });
            }
        });

    }
};

exports.generateToken = function(req, res) {
    var token = nJwt.create({
        sub: req.user._id
    }, config.secret);
    token.setExpiration(new Date().getTime() + (config.expirationtime));
    ValidToken.postValidToken(token.compact(), req.user._id);
    return res.json({ token: token.compact(), user: req.user });
}

exports.link = function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    if (email === undefined || password === undefined ) {
        res.end('Login or password cannot be empty.');
    } else {
        User.findOne({ _id: req.user._id }, function(err, user) {
            if (!user) {
                res.end('There is no user.');
            } else {
                user.local.email = req.body.email;
                user.local.password = user.generateHash(req.body.password);
                user.save(function(err) {
                    if (err)
                        res.send(err);
                    req.user = user;
                    res.end('Local account is linked successfully.')
                });
            }
        });
    }
};

exports.logout = function(req, res) {
    ValidToken.deleteValidToken(req.headers.authorization.split(" ")[1]);
    res.json('Logout successfully.');
};

exports.unlinkFacebook = function(req, res) {
    User.findOne({ _id: req.user._id }, function(err, user) {
        if (!user) {
            res.end('There is no user.');
        } else {
            user.facebook = null;
            user.save(function(err) {
                if (err)
                    throw err;
                res.end('Facebook account is unlinked successfully.')
            });
        }
    });
};

exports.unlinkLocal = function(req, res) {
    User.findOne({ _id: req.user._id }, function(err, user) {
        if (!user) {
            res.end('There is no user.');
        } else {
            user.local = null;
            user.save(function(err) {
                if (err)
                    throw err;
                res.end('Local account is unlinked successfully.')
            });
        }
    });
};

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.secret,
    strategy: ["HS256"],
    passReqToCallback: true
}, function(req, jwt_payload, done) {
    console.log('req');
    ValidTokenBase.findOne({ value: req.headers.authorization.split(" ")[1] }, function(err, validToken) {
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
                }
            });
        } else {
            done(null, false);
        }
    });
}));



passport.use(new FacebookStrategy({
        clientID: "1593351117580473",
        clientSecret: "c1b3b0fb3b72ca78b64ad302f58f287e",
        callbackURL: "http://localhost:5000/api/facebook/login/callback",
        profileFields: ['id', 'emails'],
        passReqToCallback: true
    },
    function(req, token, refreshToken, profile, done) {
        var jwtToken;
        var userIdFromToken;


        sync.fiber(function() {
            User.findOne({ 'facebook.id': profile.id }, function(err, userFromFacebook) {
                if (err) {
                    return done(err);
                }
                if (req.query.state === undefined && userFromFacebook != null) {
                    //For login method with Facebook
                    return done(null, userFromFacebook);
                } else if (req.query.state !== undefined && userFromFacebook != null) {
                    //For linking method- facebook account is already linked
                    return done('Facebook account is already linked with another one.')
                } else {
                    if (req.query.state != null) {
                        jwtToken = req.query.state.split(" ")[1];
                    }
                    if (jwtToken == null) {
                        //Add new facebook account without local account - no token
                        return addNewFacebookAccount(new User, profile, token, done);
                    } else {
                        sync.fiber(function() {
                            ValidTokenBase.findOne({ value: jwtToken }, function(err, validToken) {
                                if (err) {
                                    throw err;
                                }
                                if (validToken) {
                                    userIdFromToken = validToken.userId;
                                    if (userIdFromToken == null) {
                                        //Add new facebook account without local account - active token found, but not local userid
                                        return addNewFacebookAccount(new User, profile, token, done);
                                    } else {
                                        sync.fiber(function() {

                                            User.findOne({ '_id': userIdFromToken }, function(err, userFromToken) {
                                                if (err) {
                                                    throw err;
                                                }
                                                if (userFromToken == null) {
                                                    //Add new facebook account without local account - no local user found
                                                    return addNewFacebookAccount(new User, profile, token, done);
                                                } else {
                                                    //Add new facebook account and connect to local account
                                                    return addNewFacebookAccount(userFromToken, profile, token, done);
                                                }
                                            });
                                        });
                                    }
                                } else {
                                    //Add new facebook account without local account - no active token found
                                    return addNewFacebookAccount(new User, profile, token, done);
                                }
                            });
                        });
                    }

                }
            });
        });
    }));

function addNewFacebookAccount(user, profile, token, done) {
    user.facebook.id = profile.id;
    user.facebook.token = token;
    user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
    user.facebook.email = profile.emails[0].value;
    user.save(function(err) {
        if (err)
            throw err;
        return done(null, user);
    });

};


exports.isFacebookAuthenticated = passport.authenticate('facebook', { session: true });
exports.isJWTAuthenticated = passport.authenticate('jwt', { session: true });