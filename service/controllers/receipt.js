var Receipt = require('../models/receipt');
var ocr=require('../models/ocr').OCR;
var sync=require('synchronize');

exports.postAtt = function(req, res) {
    sync.fiber(function(){
		try{
		var data = sync.await(ocr(req.body.att,sync.defer()));
		console.log(data);
	    	var receipt = new Receipt();
	    	receipt.att = req.body.att;
	    	receipt.userId = req.user._id;
		receipt.dateCreation = Date.now();
		receipt.textReceipt = data.textReceipt;
		receipt.companyName = data.companyName;
		receipt.nip = data.nip;
		receipt.dateReceipt = data.dateReceipt;
		receipt.price = data.price;
	    	receipt.save(function(err) {
	        	if (err)
	            		res.send(err);
	        	res.json({ message: 'Receipt added to the wallet!', id:receipt._id, data: receipt });
	    	});
		}catch(err){
			res.json({message: 'Unable to read att ', error: err});
		}
	});
}

exports.postReceipts = function(req, res) {
    var receipt = new Receipt();
    receipt.userId = req.user._id;
    receipt.categoryId = req.body.categoryId;
    receipt.dateCreation = Date.now();
    receipt.dateReceipt = req.body.dateReceipt;
    receipt.companyName = req.body.companyName;
    receipt.nip = req.body.nip;
    receipt.price = req.body.price;
    receipt.textReceipt = "";
    receipt.att = req.body.att;

    receipt.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Receipt added to the wallet!', id:receipt._id, data: receipt });
    });
}

exports.getReceipts = function(req, res) {
    Receipt.find({userId: req.user._id},function(err, receipts) {
        if (err)
            res.send(err);
	allReceipts=[];
	for(var num in receipts)
		allReceipts.push({id:receipts[num]._id, data:receipts[num]});
        res.json(allReceipts);
   });
}

exports.getReceipt = function(req, res) {
    Receipt.findById(req.params.receipt_id, function(err, receipt) {
        if (err)
            res.send(err);
	if (!receipt)
	    res.json({message: 'Could not find receipt in the wallet!', data:null});
	else
            res.json({message: 'Receipt found in the wallet!', data:receipt});
    });
}

exports.putReceipt = function(req, res) {
    Receipt.findById(req.params.receipt_id, function(err, receipt) {
        if (err)
            res.send(err);
        if (!receipt)
	    res.json({message: 'Could not find receipt in the wallet!', data:null});
	else{
            receipt.categoryId = req.body.categoryId;
            receipt.LastModification = Date.now();
            receipt.dateReceipt = req.body.dateReceipt;
            receipt.companyName = req.body.companyName;
            receipt.nip = req.body.nip;
            receipt.price = req.body.price;

            receipt.save(function(err) {
            if (err)
                res.send(err);

                res.json({ message: 'Receipt update in the wallet!', data: receipt });
            });
	}
    });
}

exports.deleteReceipt = function(req, res) {
    Receipt.findById(req.params.receipt_id, function(err, receipt) {
        if (err)
            res.send(err);
	if (!receipt)
	    res.json({message: 'Could not find receipt in the wallet!'});
	else{
	    receipt.remove(function(err) {
                if (err) res.send(err);
                res.json({ message:'User successfully deleted!'});
            });
	}
    });
}
