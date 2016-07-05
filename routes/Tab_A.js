var contacts = require('../models/contacts.js');
var PREFIX = '/A';

module.exports = function (app, db) {
    // GET ALL BOOKS
    app.get(PREFIX + '/api/books', function (req, res) {
        Contacs.find(function (err, books) {
            if (err) return res.status(500).send({ error: 'database failure' });
            res.json(books);
        })
    });
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
}
