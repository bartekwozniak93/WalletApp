// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var receiptController = require('./controllers/receipt');
var userController = require('./controllers/user');
var passport = require('passport');
var authController = require('./controllers/auth');
var config = require('./config');
var app = express();

mongoose.connect(config.dbconnection);
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(user, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

var router = express.Router();


// Create endpoint handlers for /receipts
//router.route('/receipts')
//    .post(authController.isJWTAuthenticated, receiptController.postReceipts)
//    .get(authController.isJWTAuthenticated, receiptController.getReceipts);
//
//router.route('/receiptsa')
//    .get(receiptController.getReceipts);

// Create endpoint handlers for /receipts/:receipt_id
//router.route('/receipts/:receipt_id')
//    .get(authController.isAuthenticated, receiptController.getReceipt)
//    .put(authController.isAuthenticated, receiptController.putReceipt)
//    .delete(authController.isAuthenticated, receiptController.deleteReceipt);


router.route('/local/users')
    .post(userController.postUsers, authController.generateToken)
    //.get(authController.isJWTAuthenticated, userController.getUsers);

router.route('/local/login')
    .post(authController.authenticateLocal, authController.generateToken);

router.route('/local/link')
    .post(authController.isJWTAuthenticated, authController.link);

router.route('/local/unlink')
    .post(authController.isJWTAuthenticated, authController.unlinkLocal);

router.post('/facebook/login', passport.authenticate('facebook', { scope: 'email' }));

router.route('/facebook/link').post(function(request, response) {
    passport.authenticate("facebook", {
        scope: 'email',
        state: request.body.authorization
    })(request, response);
});

router.route('/facebook/unlink')
    .post(authController.isJWTAuthenticated, authController.unlinkFacebook);

router.get('/facebook/login/callback',
    passport.authenticate('facebook'), authController.generateToken);

router.route('/local/logout')
    .post(authController.isJWTAuthenticated, authController.logout);



app.use('/api', router);

app.listen(5000);