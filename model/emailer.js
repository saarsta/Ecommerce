const nodemailer = require('nodemailer');
var config = require('../config');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.nodemailer["userName"],
        pass: config.nodemailer["pass"]
    }
});

emailer = {}

emailer.sendOrderConfirmation = function (address, firstName, cb) {
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"ECOMMERCE" <ecommerce@ecommerce.com>',
        to: address,
        subject: 'Order Confirmation',
        text: 'Hello ' + firstName + ',\n\n' +  "Your ticket is on the way." + '\n\n' + "Bless," + '\n' + "ECOMMERCE",
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (err, info) => {
        if (err){
            console.error(err);
           cb(err);
        }else {
            console.log('Message sent: ' + info.response);
            cb(err, info);
        }
    });
}

module.exports = emailer;