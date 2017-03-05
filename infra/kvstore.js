var fs = require('fs');
var _ = require('underscore');

kvstore = {};

kvstore.setDbPath = function (dbpath) {
    kvstore.dbPath = dbpath;
    if (!fs.existsSync(dbpath)) {
        writeToFile({}, function () {
        });
    }
};

var writeToFile = function (kvMap, cb) {
    fs.writeFile(kvstore.dbPath, JSON.stringify(kvMap, null, 2), 'utf8', function (err) {
        cb(err);
    });
};

var readFromFile = function (cb) {
    fs.readFile(kvstore.dbPath, 'utf8', function (err, data) {
        if (err) {
            cb(err);
        } else {
            var kvMap = JSON.parse(data);
            cb(err, kvMap);
        }
    });
};

kvstore.getAllAsList = function (cb) {
    readFromFile(function (err, kvMap) {
        var ret = [];
        for (var k in kvMap) {
            var v = kvMap[k];
            ret.push({k, v});
        }
        cb(err, ret);
    });
};

kvstore.put = function (k, v, cb) {
    readFromFile(function (err, kvMap) {
        if (err) {
            cb(err);
        } else {
            kvMap[k] = v;
            writeToFile(kvMap, cb);
        }
    });
};

kvstore.remove = function (k, cb) {
    readFromFile(function (err, kvMap) {
        if (err) {
            cb(err);
        } else {
            delete kvMap[k];
            writeToFile(kvMap, cb);
        }
    });
};

module.exports = kvstore;