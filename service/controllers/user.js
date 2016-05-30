var nJwt = require('njwt');
var ValidToken = require('../controllers/validToken');
var User = require('../models/user');
var config = require('../config');


exports.postUsers = function(req, res, next) {
    User.findOne({ 'local.email': req.body.email }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
            res.json('That email is already taken.');
        } else {
            var user = new User();
            user.local.email = req.body.email;
            user.local.password = user.generateHash(req.body.password);
            user.save(function(err) {
                if (err)
                    res.send(err);

                req.user = user;
                next();
            });

        }
    });
};


exports.getUsers = function(req, res) {
    User.find(function(err, users) {
        if (err)
            res.send(err);

        res.json(users);
    });
};