var fs = require('fs');
var _ = require('underscore');
var config = require('../config.js');
var emailer = require('./emailer.js');
var kvstore = require('../infra/kvstore.js');
var ppwrapper = require('../infra/ppwrapper.js');

const uuidV1 = require('uuid/v1'); // Generate a v1 UUID (time-based)

payments = {};

kvstore.setDbPath(config.db.Path);

// get payment transactions, set it format
payments.getAll = function(cb) {
    kvstore.getAllAsList(function(err, kvList) {
        let transRows = [];
        _.forEach(kvList, function (row) {
            var trans = row.v;
            trans.uuid = row.k;
            transRows.push(trans);
        });
        cb(err, transRows);
    });
};


payments.addPayment = function(trans, cb) {
    var uuid = uuidV1();
    trans.timestamp = new Date().getTime();

    kvstore.put(uuid, trans, function (err) {
        if(err) {
            console.error(err);
            cb(err)
        } else {
            emailer.sendOrderConfirmation(trans.email, trans.firstName, cb);
        }
    });
};

payments.deleteTransaction = function(transactionId, cb) {
    kvstore.remove(transactionId, function (err) {
        if(err) {
            console.error(err);
        }
        cb(err);
    });
};

module.exports = payments;