var basicAuth = require('basic-auth');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('underscore');
var config = require(__dirname + '/../config.js');
var payments = require('../model/payments.js');

//add basic auth to admin page
var auth = function (req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    };

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };

    if (user.name === config.admin.userName && user.pass === config.admin.pass) {
        return next();
    } else {
        return unauthorized(res);
    };
};

router.get('/',auth, function(req,res){

    payments.getAll(function(err, trans){
        if (err){
            return res.status(500).send(err.stack);
        }

        res.render('admin',{trans: trans});
    });

    /*// read file line by line (each purchase)
    fs.readFile(__dirname + '/../db.txt','utf8',(e, str) => {
        if(e)
            return res.status(500).send(e.stack);
        console.log(str);
        let counter = 1;
        let users = str.split('\n').map(function(line) {
            let [email, firstName, lastName, country, date] = line.split(',');
            return {lineNumber : counter++, email, firstName, lastName, country, date : date && new Date(parseInt(date)).toString()}; // parse date to strinng format
        });

        users = _.reject(users, function(user){ return !user.email}); // make sure there is no empty rows
        res.render('admin',{users:users});
    });*/
});

router.delete('/payment', function(req, res){

    let transIdd = req.query.id;

    payments.deleteTransaction(transIdd, function(err) {
        if (err) return console.log(err);
        res.send('Thank you too');
    });

    /*//delete purchase line
     fs.readFile(__dirname + '/../db.txt', 'utf8', function (err, data) {
     if (err) return console.log(err);

     let lines = data.split('\n');

     //get purchase line and empty it, and delete it
     //lines = _.each(lines, function(line){  return ""});
     console.log("date --> " + date.getTime())
     console.log("before --> " + lines)
     lines = _.reject(lines, function(line){ return line.indexOf(date.getTime()) !== -1;});
     console.log("after --> " + lines)

     //////////////////////////////having problem with this
     fs.writeFile(__dirname + '/../db1.txt', lines.join('\n'), 'utf8', function (err) {
     if (err) return console.log(err);
     res.send('Thank you too');
     });
     });*/
});


module.exports = router;