// Load required packages
var ValidToken = require('../models/validToken');


// Create endpoint /api/users for POST
exports.postValidToken = function(validToken, userId) {
    var validToken = new ValidToken({
        value: validToken,
        userId: userId
    });

    validToken.save(function(err) {
        if (err)
            console.log(err);
    });
};

// Create endpoint /api/receipts/:receipt_id for DELETE
exports.deleteValidToken = function(validToken) {
    // Use the Receipt model to find a specific receipt and remove it
    ValidToken.remove({ value: validToken }, function(err) {
        if (err)
            console.log(err);
    });
};