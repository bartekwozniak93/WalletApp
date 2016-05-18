var Receipt = require('../models/receipt');
var ocr=require('../models/ocr').OCR;
var sync=require('synchronize');

exports.postAtt = function(req, res) {
	try{
        ocr(req.body.att,function(err,data){
            if(err)
                res.send(err);
            
            var receipt = new Receipt();
            receipt.att = req.body.att;
            receipt.textReceipt = data.textReceipt;
            receipt.userId = req.user._id;
            
            if(req.body.dateCreation == undefined)
                receipt.dateCreation = Date.now();
            else   
                receipt.dateCreation = req.body.dateCreation;
            
            if(req.body.companyName == undefined)
                receipt.companyName = data.companyName;
            else
                receipt.companyName = req.body.companyName;

            if(req.body.nip == undefined)
                receipt.nip = data.nip;
            else
                receipt.nip = req.body.nip;

            if(req.body.dateReceipt == undefined)
                receipt.dateReceipt = data.dateReceipt;
            else
                receipt.dateReceipt = req.body.dateReceipt;

            if(req.body.price == undefined)
                receipt.price = data.price;
            else
                receipt.price = req.body.receipt;

            receipt.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Receipt added to the wallet!', id:receipt._id, data: receipt });
            });
        });
	}catch(err){
		res.json({message: 'Unable to read att ', error: err});
	}
}

/*exports.postReceipts = function(req, res) {
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
}*/

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
        if (!receipt || req.user._id !=  receipt.userId)
            res.json({message: 'Could not find receipt in the wallet!', data:null});
        else
            res.json({message: 'Receipt found in the wallet!', data:receipt});
    });
}

exports.putReceipt = function(req, res) {
    Receipt.findById(req.params.receipt_id, function(err, receipt) {
        if (err)
            res.send(err);
        if (!receipt || req.user._id !=  receipt.userId)
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
        if (!receipt || req.user._id !=  receipt.userId)
            res.json({message: 'Could not find receipt in the wallet!'});
        else{
            receipt.remove(function(err) {
                if (err) res.send(err);
                res.json({ message:'User successfully deleted!'});
            });
	   }
    });
}
