var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('underscore');
var transporter = require('./../model/emailer');
var config = require(__dirname + '/../config.js');
var payments = require('../model/payments.js');
var Paypal = require('../infra/ppwrapper.js');

// GET home page
router.get('/', function (req, res) {
    res.render('index', {ticketInfo: config.ticket, title: 'Tickets', subTitle: "Don't miss it"});
});

// Get payment page
router.get('/payment', function (req, res) {
    res.render('payment',
        {
            purchaseInfo: {
                totalPrice: req.query.tp,
                description: req.query.d || config.ticket.description,
                currency: config.ticket.currency
            }
        }
    );
});

router.get('/thankyou', function (req, res) {
    res.render('thankyou', {email: req.query.email});
});

// adding transaction
router.post('/payment', function (req, res, next) {
    var trans = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        country: req.body.country,
        totalPrice: req.body.totalPrice,
        productDescription: req.body.productDescription
    };

    //server validation
    if (!isValidate({email: trans.email, firstName: trans.firstName, lastName: trans.lastName}))
        return next(new Error('Validation Error'));

    Paypal.startCheckout(trans, function (err, redirectURL) {

        if (err)
            return next(err);

        res.json({redirectURL});
    });
});


function isValidate(details) {
    return (validateEmail(details.email) && details.firstName && details.lastName);
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports = router;
