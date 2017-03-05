var ppwrapper = require('paypal-rest-sdk');
var config = require('../config');

const ROOT_PATH = 'http://localhost:3000';

ppwrapper.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': config.paypal.client_id,
    'client_secret': config.paypal.client_secret
});

exports.startCheckout = function (params, callback) {
    ppwrapper.payment.create({
        intent: "sale",
        payer: {
            payment_method: "paypal"
        },
        redirect_urls: {
            return_url: ROOT_PATH + "/paypal/approved?params=" + encodeURIComponent(JSON.stringify(params)),
            cancel_url: ROOT_PATH + "/paypal/canceled"
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: params.productDescription,
                            price: parseFloat(params.totalPrice).toFixed(2),
                            currency: "USD",
                            quantity: 1
                        }
                    ]
                },
                amount: {
                    currency: "USD",
                    total: parseFloat(params.totalPrice).toFixed(2)
                },
                description: params.productDescription
            }
        ]
    }, function (err, response) {
        if (err)
            return callback(err);

        var i, len, link, ref;
        ref = response.links;
        for (i = 0, len = ref.length; i < len; i++) {
            link = ref[i];
            if (link.method === 'REDIRECT') {
                return callback(null, link.href);
            }
        }
        return callback(new Error('bad response from paypal'));
    });
};

exports.executePayment = function (req, callback) {
    var params = JSON.parse(req.query.params);

    ppwrapper.payment.execute(req.query.paymentId, {
        payer_id: req.query.PayerID,
        transactions: [
            {
                amount: {
                    currency: "USD",
                    total: parseFloat(params.totalPrice)
                }
            }
        ]
    }, function (e, payment) {
        if (e)
            return callback(e);
        params.paymentId = payment.id;
        params.paymentType = "PAYPAL";
        callback(null, params);
    });
};
