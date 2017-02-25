var fs = require('fs');
var _ = require('underscore');
var config = require('../config.js');
var emailer = require('./emailer.js');
var kvstore = require('../infra/kvstore.js');
const uuidV1 = require('uuid/v1'); // Generate a v1 UUID (time-based)

payments = {};

//payments.dbFilePath = __dirname + '/../db-payments.txt' /*config.db.Path*/;
/*payments.dbFilePath = config.db.Path;*/
kvstore.setDbPath(config.db.Path);

payments.getAll = function(cb) {
    kvstore.getAll(function(err, kvList) {
        let transRows = [];
        let counter = 1;
        _.forEach(kvList, function (row) {
            var trans = row.v;
            trans.uuid = row.k;
            trans.lineNumber = counter++;
            transRows.push(trans);
        });
        cb(err, transRows);
    });
    //fs.readFile(payments.dbFilePath,'utf8',(e, str) => {
    //    if(e) {
    //        cb(e)
    //    } else {
    //        console.log(str);
    //        let counter = 1;
    //        let transRows = str.split('\n')
    //            .filter(function (line) {
    //                return line != '';
    //            }).map(function (line) {
    //                var uuidTransIndex = line.indexOf(' ');
    //                var uuid = line.substring(0, uuidTransIndex);
    //                var trans = uuidTransIndex != -1 && JSON.parse(line.substring(uuidTransIndex + 1));
    //                trans.lineNumber = counter++;
    //                trans.uuid = uuid;
    //                return trans;
    //        });
    //
    //        // validate rows
    //        //transRows = _.reject(transRows, function(trans){ return ( !trans || (trans.uuid == ""))});
    //
    //        cb(e, transRows);
    //
    //    }
    //});
};

payments.addPayment = function(trans, cb) {

    var uuid = uuidV1();
    kvstore.put(uuid, trans, function (err) {
        if(err) {
            console.error(err);
            cb(err)
        } else {
            emailer.sendOrderConfirmation(trans.email, trans.firstName, cb);
        }
    });

    //var transcationSerializedForm = JSON.stringify(trans);
    //
    //fs.appendFile(payments.dbFilePath, uuid + " " + transcationSerializedForm + '\n', function (err) {
    //    if(err) {
    //        console.error(err);
    //        cb(err)
    //    } else {
    //        emailer.sendOrderConfirmation(trans.email, trans.firstName, cb);
    //    }
    //});
};

payments.deleteTransaction = function(transactionId, cb) {

    kvstore.remove(transactionId, function (err) {
        if(err) {
            console.error(err);
        }
        cb(err);
    });

    ////delete purchase line
    //fs.readFile(payments.dbFilePath, 'utf8', function (err, data) {
    //    if (err) return console.log(err);
    //
    //    let lines = data.split('\n');
    //
    //    // remove transaction line
    //    lines = _.reject(lines, function(line){ return (line.indexOf(transactionId) != -1) || !line});
    //    //lines[lines.length - 1] += '\n';
    //
    //    fs.writeFile(payments.dbFilePath, lines.join('\n'), 'utf8', function (err) {
    //        if (err) return console.log(err);
    //        cb(err);
    //    });
    //});
};

module.exports = payments;