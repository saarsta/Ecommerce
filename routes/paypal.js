var express = require('express');
var router = express.Router();
var payments = require('../model/payments.js');
var Paypal = require('../infra/ppwrapper.js');

router.get('/approved', function (req, res, next) {
    Paypal.executePayment(req, function (err, params) {
        if (err) {
            return next(err);
        } else {
            console.log('save to db', params);
            payments.addPayment(params, function (err) {
                if (err) {
                    return next(err);
                } else {
                    res.redirect('/thankyou?email=' + params.email);
                }
            });
        }
    })
});

router.get('/canceled', function (req, res) {
    res.render('error', new Error('bad response from paypal'));
});

module.exports = router;
