var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('underscore');
var transporter = require('./../model/emailer');
var config = require(__dirname + '/../config.js');
var payments = require('../model/payments.js');

// GET home page
router.get('/', function(req, res, next) {
    res.render('index', { ticketPrice : config.ticketPrice, title : 'Tickets', subTitle:"Don't miss it" }); //what where do i see it
});

router.get('/payment', function(req, res) {
    res.render('payment',{totalPrice: req.query.p, title:`It's pay day`, subTitle:`Show me the money`});
});

router.post('/payment', function(req, res){
    let {email, firstName, lastName, country, totalPrice} = req.body;

    var trans = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        country: req.body.lastName,
        totalPrice: req.body.totalPrice
    };

    //server validation
    if(!isValidate({email, firstName, lastName}))
        return res.status(400).send('ERROR');

    payments.addPayment(trans, function(err){
        if (err) {
            return res.status(500).send('ERROR');
        }

        res.send('Hi! check your mail for order details');
    });
/*

    fs.appendFile(__dirname + '/../db.txt', [email,firstName,lastName,country,date].join(',') + '\n', function (err) {
        if(err) {
            console.error(err);
            return res.status(500).send('ERROR');
        }

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"ECOMMERCE" <ecommerce@ecommerce.com>',
            to: email,
            subject: 'Order Confirmation',
            text: 'Hello ' + firstName + ',\n\n' +  "Your ticket is on the way." + '\n\n' + "Bless," + '\n' + "ECOMMERCE",
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (err, info) => {
            if (err){
                console.error(err);
                return res.status(500).send('ERROR');
            }

            console.log('Message sent: ' + info.response);
            res.send('Hi! check your mail for order details');
        });
    });
*/
});


module.exports = router;

function isValidate(details){
    return (validateEmail(details.email) && details.firstName && details.lastName);
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
