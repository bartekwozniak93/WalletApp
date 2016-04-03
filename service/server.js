// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var receiptController = require('./controllers/receipt');
var userController = require('./controllers/user');
var passport = require('passport');
var authController = require('./controllers/auth');
var config = require('./config');

// Connect to the receiptwallet MongoDB
mongoose.connect(config.dbconnection);

// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));

// Use the passport package in our application
app.use(passport.initialize());

// Create our Express router
var router = express.Router();

// Create endpoint handlers for /receipts
router.route('/receipts')
    .post(authController.isAuthenticated, receiptController.postReceipts)
    .get(authController.isAuthenticated, receiptController.getReceipts);

// Create endpoint handlers for /receipts/:receipt_id
router.route('/receipts/:receipt_id')
    .get(authController.isAuthenticated, receiptController.getReceipt)
    .put(authController.isAuthenticated, receiptController.putReceipt)
    .delete(authController.isAuthenticated, receiptController.deleteReceipt);

// Create endpoint handlers for /users
router.route('/users')
    .post(userController.postUsers)
    .get(authController.isJWTAuthenticated, userController.getUsers);

router.route('/login')
    .post(authController.login)

router.route('/logout')
    .post(authController.isJWTAuthenticated, authController.logout)

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(5000);