// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var ReceiptSchema   = new mongoose.Schema({
  name: String,
  category: String,
  sum: Number,
  userId: String
});

// Export the Mongoose model
module.exports = mongoose.model('Receipt', ReceiptSchema);