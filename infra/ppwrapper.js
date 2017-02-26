var paypal = require('paypal-rest-sdk');
var _ = require('underscore');

ppwrapper = {};

ppwrapper.foo = function (cb) {
    var payment = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://yoururl.com/execute",
            "cancel_url": "http://yoururl.com/cancel"
        },
        "transactions": [{
            "amount": {
                "total": "5.00",
                "currency": "USD"
            },
            "description": "My awesome payment"
        }]
    };

    paypal.payment.create(payment, function (err, payment) {
        if (err) {
            console.log(err);
            cb(err)
        } else {
            if(payment.payer.payment_method === 'paypal') {
                //req.session.paymentId = payment.id;
                var redirectUrl;
                for(var i=0; i < payment.links.length; i++) {
                    var link = payment.links[i];
                    if (link.method === 'REDIRECT') {
                        redirectUrl = link.href;
                    }
                }
                cb()
            }
        }
    });
};

module.exports = ppwrapper;