var basicAuth = require('basic-auth');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('underscore');
var config = require('../config.js');
var payments = require('../model/payments.js');

//add basic auth to admin page
var auth = function (req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    }

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    }

    if (user.name === config.admin.userName && user.pass === config.admin.pass) {
        return next();
    } else {
        return unauthorized(res);
    }
};

// GET purchases sorted list
router.get('/',auth, function(req,res){
    payments.getAll(function(err, transRows){
        if (err){
            return res.status(500).send(err.stack);
        }
        transRows = _.sortBy(transRows, function(t) { return t.timestamp; });

        // add row number to transaction
        var c = 1;
        transRows = _.map(transRows, function (row) {
            row.lineNumber = c++;
            return row;
        });
        res.render('admin',{trans: transRows, currency : config.ticket.currency});
    });
});

// on delete transaction
router.delete('/payment', function(req, res){
    var transIdd = req.query.id;

    payments.deleteTransaction(transIdd, function(err) {
        if (err) return console.log(err);
        res.send('Deleted');
    });
});

module.exports = router;