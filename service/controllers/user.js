var nJwt = require('nJwt');

// Load required packages
var User = require('../models/user');
var config = require('../config');

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
    var user = new User({
        username: req.body.username,
        password: req.body.password
    });

    user.save(function(err) {
        if (err)
            res.send(err);

        var claims = {
            sub: user._id
        }

        var token = nJwt.create(claims, config.secret);
        token.setExpiration(new Date().getTime() + (config.expirationtime));
        res.json(token.compact());
    });
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
    User.find(function(err, users) {
        if (err)
            res.send(err);

        res.json(users);
    });
};