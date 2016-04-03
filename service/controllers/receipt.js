// Load required packages
var Receipt = require('../models/receipt');

// Create endpoint /api/receipts for POSTS
exports.postReceipts = function(req, res) {
    // Create a new instance of the Receipt model
    var receipt = new Receipt();

    // Set the receipt properties that came from the POST data
    receipt.name = req.body.name;
    receipt.category = req.body.category;
    receipt.sum = req.body.sum;
    receipt.userId = req.user._id;

    // Save the receipt and check for errors
    receipt.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Receipt added to the wallet!', data: receipt });
    });
};

// Create endpoint /api/receipts for GET
exports.getReceipts = function(req, res) {
    // Use the Receipt model to find all receipts
    Receipt.find(function(err, receipts) {
        if (err)
            res.send(err);

        res.json(receipts);
    });
};

// Create endpoint /api/receipts/:receipt_id for GET
exports.getReceipt = function(req, res) {
    // Use the Receipt model to find a specific receipt
    Receipt.findById(req.params.receipt_id, function(err, receipt) {
        if (err)
            res.send(err);

        res.json(receipt);
    });
};

// Create endpoint /api/receipt/:receipt_id for PUT
exports.putReceipt = function(req, res) {
    // Use the Receipt model to find a specific receipt
    Receipt.findById(req.params.receipt_id, function(err, receipt) {
        if (err)
            res.send(err);

        // Update the existing receipt sum
        receipt.sum = req.body.sum;

        // Save the receipt and check for errors
        receipt.save(function(err) {
            if (err)
                res.send(err);

            res.json(receipt);
        });
    });
};

// Create endpoint /api/receipts/:receipt_id for DELETE
exports.deleteReceipt = function(req, res) {
    // Use the Receipt model to find a specific receipt and remove it
    Receipt.findByIdAndRemove(req.params.receipt_id, function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Receipt removed from the wallet!' });
    });
};