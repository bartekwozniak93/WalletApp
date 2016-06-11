var nJwt = require('njwt');
var ValidToken = require('../controllers/validToken');
var User = require('../models/user');
var config = require('../config');
var nodemailer = require('nodemailer');

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

exports.remaindLocalPassword = function(req, res) {
    
    if (email == undefined) {
        res.end('Email cannot be empty.');
    } else {
    	var email = req.body.email;
        User.findOne({ 'local.email': email }, function(err, user) {
            if (err) {
                res.send(err);
            }
            if (!user) {
                return res.json('User not found');
            } else {
		var newPassword=randomString(8);
                user.local.password=user.generateHash(newPassword); 
		user.save(function(err) {
		        if (err)
		            res.send(err);
			var transporter = nodemailer.createTransport({
  				service: 'Gmail',
  				auth: 	{
    					user: config.gmailuser,
    					pass: config.gmailpass
	  				}
			});
			var mail = {
				from: "WalletApp <"+config.gmailuser+">",
				to: user.local.email,
				subject: "WalletApp service",
				text: "New password for you -- "+ newPassword+ " -- try it",
			}
	   		transporter.sendMail(mail, function(error, response){
				if(error){
				    res.send(err);
				}else{
				    res.json({ message: 'Password send to email'});
				}
			});
            	});     
            }
        });

    }
};

exports.getUsers = function(req, res) {
    User.find(function(err, users) {
        if (err)
            res.send(err);

        res.json(users);
    });
};

exports.getUser= function(req, res) {
    User.findOne({ _id: req.user._id }, function(err, user) {
        if (!user) {
            res.end('There is no user.');
        } else {
            res.json(user);
        }
    });
};
