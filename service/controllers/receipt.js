var Receipt = require('../models/receipt');
var ocr=require('../models/ocr').OCR;
var sync=require('synchronize');

exports.postAtt = function(req, res) {
    console.log(req);
    sync.fiber(function(){
		try{
			var data = sync.await(ocr(req.body.att,sync.defer()));
	    	var receipt = new Receipt();
	    	receipt.att = req.body.att;
	    	receipt.userId = req.user._id;
			receipt.textReceipt = data.textReceipt;
			receipt.companyName = data.companyName;
			receipt.nip = data.nip;
			receipt.dateReceipt = data.dateReceipt;
			receipt.price = data.price;
	    	receipt.save(function(err) {
	        	if (err)
	            	res.send(err);
	        	res.json({ message: 'Receipt added to the wallet!', data: receipt });
	    	});
		}catch(err){
			res.send(err);
		}
	});
}

//exports.postReceipts = function(req, res) {
//    var receipt = new Receipt();
//    receipt.name = req.body.name;
//    receipt.category = req.body.category;
//    receipt.sum = req.body.sum;
//    receipt.userId = req.user._id;
//
//    receipt.save(function(err) {
//        if (err)
//            res.send(err);
//
//        res.json({ message: 'Receipt added to the wallet!', data: receipt });
//    });
//};
//
//exports.getReceipts = function(req, res) {
//    Receipt.find(function(err, receipts) {
//        if (err)
//            res.send(err);
//
//        res.json(receipts);
//    });
//};
//
//exports.getReceipt = function(req, res) {
//    Receipt.findById(req.params.receipt_id, function(err, receipt) {
//        if (err)
//            res.send(err);
//
//        res.json(receipt);
//    });
//};
//
//exports.putReceipt = function(req, res) {
//    Receipt.findById(req.params.receipt_id, function(err, receipt) {
//        if (err)
//            res.send(err);
//
//        receipt.sum = req.body.sum;
//
//        receipt.save(function(err) {
//            if (err)
//                res.send(err);
//
//            res.json(receipt);
//        });
//    });
//};
//
//exports.deleteReceipt = function(req, res) {
//    Receipt.findByIdAndRemove(req.params.receipt_id, function(err) {
//        if (err)
//            res.send(err);
//
//        res.json({ message: 'Receipt removed from the wallet!' });
//    });
//};
