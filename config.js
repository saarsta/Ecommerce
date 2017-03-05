var config = {};

config.db = {};
config.ticket = {};
config.admin = {};
config.nodemailer = {};
config.paypal = {};

console.log('-->', process.env.PAYPAL_CLIENT_ID);
console.log('-->', process.env.PAYPAL_CLIENT_SECRET);

config.db.Path = __dirname + '/db-payments.txt';

config.ticket.price = 10;
config.ticket.currency = '$';
config.ticket.description = 'Party Ticket';

config.admin["userName"] = 'admin';
config.admin["pass"] = 'admin';

config.nodemailer["userName"] = process.env.NODEMAILER_USERNAME;
config.nodemailer["pass"] =  process.env.NODEMAILER_PASS;

config.paypal = {
    "host" : "api.sandbox.paypal.com",
    "port" : "",
    "client_id" : process.env.PAYPAL_CLIENT_ID,
    "client_secret" : process.env.PAYPAL_CLIENT_SECRET
};

module.exports = config;