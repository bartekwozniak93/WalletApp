// Load required packages
var mongoose = require('mongoose');

var ValidTokenSchema   = new mongoose.Schema({
  value: String,
  userId: String
});

// Export the Mongoose model
module.exports = mongoose.model('ValidToken', ValidTokenSchema);