var user = require('../models/user.js');
var contacts = require('../models/contacts.js');
var PREFIX = '/A';
module.exports = function (app, db) {
    app.get(PREFIX + '/api/hello', function (req, res) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        console.log("hello");
        res.write("Hello A");
        res.end();
    });
    app.get(PREFIX + '/api/bye', function (req, res) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        console.log("bye");
        res.write("Bye A");
        res.end();
    });
    app.get(PREFIX + '/contacts', function (req, res) {
        contacts.find(function (err, contactsList) {
            if (err)
                return console.error(err);

            var json="["+contactsList+"]";

            console.log("Sending current Contacts : " + json);
            res.write(json);
            res.end();
        });
    });
    app.post(PREFIX + '/contacts', function(req, res) {
        db.collections['contacts'].drop(function (err) {
            console.log('collection dropped');
            for(var i=0;i<req.body.length;i++) {
                console.log("Person " + i + req.body[i].name);
                // console.log(req.body[i].name);
                // console.log(req.body[i].email);
                // console.log(req.body[i].phone);
                var contact = new contacts({
                    name: req.body[i].name,
                    email: req.body[i].email,
                    phone: req.body[i].phone
                });
                contact.save(function(err, contact) {
                    if(err)
                        return console.error(err);
                });
            }
        });
        res.writeHead(201);
        res.write("Updated with posted json");
        res.end()
    });
}
