var mongoose = require('mongoose');
var contactSchema = require('../models/contacts.js');
var contactModel;
var PREFIX = '/A';
var user_id = "gaianofc";

module.exports = function (app) {
    var token;
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
        contactModel = mongoose.model(req.query.fid + "contact", contactSchema, req.query.fid);
        contactModel.find({type:"contact"},function (err, contactsList) {
            if (err) return console.error(err);
            var json = "[" + contactsList + "]";
            res.write(json);
            res.end();
        });
    });
    app.post(PREFIX + '/contacts', function (req, res) {
        contactModel = mongoose.model(req.query.fid + "contact", contactSchema, req.query.fid);
        contactModel.remove({type:"contact"}, function (err) {
            for (var i = 0; i < req.body.length; i++) {
                var contact = new contactModel({
                    type: "contact",
                    name: req.body[i].name,
                    email: req.body[i].email,
                    phone: req.body[i].phone,
										// type: "contact"
                });
                contact.save();
            }
            res.writeHead(201);
            res.write("Well reset with json");
            res.end();
        });
    });
    app.post(PREFIX + '/facebook', function (req, res) {
        token=req.body;
    })
}
