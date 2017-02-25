var fs = require('fs');
var _ = require('underscore');

kvstore = {};

kvstore.setDbPath = function (dbpath) {
    kvstore.dbPath = dbpath
    if (!fs.existsSync(dbpath)) {
        writeToFile([], function () {})
    }
};

var writeToFile = function (kvMap, cb) {
    fs.writeFile(kvstore.dbPath, JSON.stringify(kvMap, null, 2), 'utf8', function (err) {
        if (err) console.log(err);
        cb(err);
    });
};

var readFromFile = function (cb) {
    fs.readFile(kvstore.dbPath, 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            cb(err)
        } else {
            var kvList = JSON.parse(data);
            cb(err, kvList)
        }
    });
};

kvstore.getAll = function(cb) {
    readFromFile(cb);
};

kvstore.put = function(k, v, cb) {
    readFromFile(function (err, kvList) {
        if (err) {
            cb(err)
        } else {
            kvList.push({k,v});
            writeToFile(kvList, cb)
        }
    });
};

kvstore.remove = function(k, cb) {
    readFromFile(function (err, kvList) {
        if (err) {
            cb(err)
        } else {
            kvList = kvList.filter(function (kv) {
                //console.log(kv.k + " --> " + k);
                //console.log(kv.k != k);
                return kv.k != k;
            });
            writeToFile(kvList, cb)
        }
    });
};

module.exports = kvstore;