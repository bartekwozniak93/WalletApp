var mongoose = require('mongoose');

var ReceiptSchema   = new mongoose.Schema({
  name: String,
  category: String,
  sum: Number,
  userId: String
});

module.exports = mongoose.model('Receipt', ReceiptSchema);