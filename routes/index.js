var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('underscore');
var transporter = require('./../model/emailer');
var config = require(__dirname + '/../config.js');
var payments = require('../model/payments.js');

// GET home page
router.get('/', function(req, res, next) {
    res.render('index', { ticketInfo : config.ticket, title : 'Tickets', subTitle:"Don't miss it" }); //what where do i see it
});

// Get payment page
router.get('/payment', function(req, res) {
    res.render('payment',
        {purchaseInfo: {totalPrice: req.query.p, currency : config.ticket.currency},
         title:`It's pay day`,
         subTitle:`Show me the money`}
    );
});

// adding transaction
router.post('/payment', function(req, res){
    var {email, firstName, lastName, country, totalPrice} = req.body;
    var trans = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        country: req.body.country,
        totalPrice: req.body.totalPrice
    };

    //server validation
    if(!isValidate({email, firstName, lastName}))
        return res.status(400).send('ERROR');

    payments.addPayment(trans, function(err){
        if (err) {
            return res.status(500).send('ERROR');
        }

        res.send();
    });
});

function isValidate(details){
    return (validateEmail(details.email) && details.firstName && details.lastName);
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports = router;
