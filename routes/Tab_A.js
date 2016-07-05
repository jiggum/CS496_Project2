var User = require('../models/user.js');
var Contacts = require('../models/contacts.js');
var PREFIX = '/A';
module.exports = function (app, user) {
    app.get(PREFIX + '/api/hello', function (req, res) {
        var id = req.query.id;
        var helloStr ="Hello, " + id + ". This is A" 
        res.writeHead(200, { "Content-Type": "text/plain" });
        console.log(helloStr);
        res.write(helloStr);
        res.end();
    });
    app.get(PREFIX + '/api/bye', function (req, res) {
        var id = req.query.id;
        var byeStr = "Bye, " + id + ". Sincerely A";
        res.writeHead(200, { "Content-Type": "text/plain" });
        console.log(byeStr);
        res.write(byeStr);
        res.end();
    });
    app.get(PREFIX + '/contacts', function (req, res) {
        var json = user.contacts;

        res.write(json);
        res.end();
    });
    app.post(PREFIX + '/contacts', function (req, res) {
        db.collections['contacts'].drop(function (err) {
            console.log('collection dropped');
            for (var i = 0; i < req.body.length; i++) {
                console.log("Person " + i + req.body[i].name);
                // console.log(req.body[i].name);
                // console.log(req.body[i].email);
                // console.log(req.body[i].phone);
                var contact = new contacts({
                    name: req.body[i].name,
                    email: req.body[i].email,
                    phone: req.body[i].phone
                });
                contact.save(function (err, contact) {
                    if (err)
                        return console.error(err);
                });
            }
        });
        res.writeHead(201);
        res.write("Updated with posted json");
        res.end()
    });
}
