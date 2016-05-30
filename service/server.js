// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var receiptController = require('./controllers/receipt');
var userController = require('./controllers/user');
var passport = require('passport');
var authController = require('./controllers/auth');

var config = require('./config');
var express = require('express')
    , cors = require('cors')
    , app = express();

mongoose.connect(config.dbconnection);
app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));


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
router.route('/receipts')
    .post(authController.isJWTAuthenticated, receiptController.postAtt)
    .get(authController.isJWTAuthenticated, receiptController.getReceipts);

// Create endpoint handlers for /receipts/:receipt_id
router.route('/receipts/:receipt_id')
    .get(authController.isJWTAuthenticated, receiptController.getReceipt)
    .put(authController.isJWTAuthenticated, receiptController.putReceipt)
    .delete(authController.isJWTAuthenticated, receiptController.deleteReceipt);

//router.route('/receipts/att')
   // .post(authController.isJWTAuthenticated, receiptController.postAtt);

router.route('/local/users')
    .post(userController.postUsers, authController.generateToken);
//.get(authController.isJWTAuthenticated, userController.getUsers);

router.route('/local/user')
    .get(authController.isJWTAuthenticated, userController.getUser);

router.route('/local/login')
    .post(authController.authenticateLocal, authController.generateToken);

router.route('/local/link')
    .post(authController.isJWTAuthenticated, authController.link);

router.route('/local/unlink')
    .post(authController.isJWTAuthenticated, authController.unlinkLocal);



router.route('/facebook/login').post(function(request, response) {
  passport.authenticate("facebook", {
    scope: 'email',
    state: JSON.stringify({redirectTo: request.body.redirectTo})
  })(request, response);
});

router.route('/facebook/link').post(function(request, response) {
  passport.authenticate("facebook", {
    scope: 'email',
    state: JSON.stringify({token: request.body.authorization})
  })(request, response);
});

router.route('/facebook/unlink')
    .post(authController.isJWTAuthenticated, authController.unlinkFacebook);

router.get('/facebook/login/callback',
    passport.authenticate('facebook'), authController.generateTokenForFacebook);

router.route('/local/logout')
    .post(authController.isJWTAuthenticated, authController.logout);

app.use('/api', router);
var port = process.env.PORT || 8080;

app.listen(port);
