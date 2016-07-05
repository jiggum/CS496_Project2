var mongoose = require('mongoose');
var contactSchema = require('../models/contacts.js');
var contactModel;
var PREFIX = '/A';

module.exports = function (app) {
    app.get(PREFIX + '/api/hello', function (req, res) {
        var fid = req.query.fid;
        var helloStr = "Hello, " + fid + ". This is A"
        res.writeHead(200, { "Content-Type": "text/plain" });
        console.log(helloStr);
        res.write(helloStr);
        res.end();
    });
    app.get(PREFIX + '/api/bye', function (req, res) {
        var fid = req.query.fid;
        var byeStr = "Bye, " + fid + ". Sincerely A";
        res.writeHead(200, { "Content-Type": "text/plain" });
        console.log(byeStr);
        res.write(byeStr);
        res.end();
    });
    app.get(PREFIX + '/contacts', function (req, res) {

        contactModel = mongoose.model(req.query.id + "contact", contactSchema, req.query.id);
        contactModel.find(function (err, contactsList) {
            if (err)
                return console.error(err);

            var json = "[" + contactsList + "]";
            res.write(json);
            res.end();
        });
    });
    app.post(PREFIX + '/contacts', function (req, res) {
        contactModel = mongoose.model(req.query.id + "contact", contactSchema, req.query.id);
        contactModel.remove({}, function (err) {
            console.log("removed");
            for (var i = 0; i < req.body.size; i++) {
                var contact = new contactModel({
                    name: req.body[i].name,
                    email: req.body[i].email,
                    phone: req.body[i].phone
                });
                contact.save();
                console.log('Person ' + i + " name : " + req.body.name);
            }
            res.writeHead(201);
            res.write("Well reset with json");
            res.end();
        });
    });
}
