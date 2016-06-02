var mongoose = require('mongoose');

var ReceiptSchema   = new mongoose.Schema({
	userId: String, 
	categoryId: String, 
	dateCreation: Date, 
	dateLastModification: { type: Date, default: Date.now }, 
	dateReceipt: String,
	companyName: String,
	nip: String,
	price: Number,
	textReceipt: String, 
	att: String,
	attTN:String
});

module.exports = mongoose.model('Receipt', ReceiptSchema);
