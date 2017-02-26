var config = {};

config.db = {};
config.ticket = {};
config.admin = {};
config.nodemailer = {};
config.paypal = {};

config.db.Path = __dirname + '/db-payments.txt';

config.ticket.price = 10;
config.ticket.currency = '$';

config.admin["userName"] = 'admin';
config.admin["pass"] = 'admin';

config.nodemailer["userName"] = process.env.NODEMAILER_USERNAME;
config.nodemailer["pass"] =  process.env.NODEMAILER_PASS;

config.paypal = {
    "host" : "api.sandbox.paypal.com",
    "port" : "",
    "client_id" : "YOUR TEST CLIENT ID",
    "client_secret" : "YOUR TEST CLIENT SECRET"
};

module.exports = config;