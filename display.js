var mongoose = require("mongoose");
var contacts = require("./models/contacts.js");

mongoose.connect("mongodb://localhost/test");

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
    console.log("MongoDB Connected");
});

contacts.find(function (err, contactsList) {
    if (err)
        return console.error(err);
    console.log(contactsList);
    db.close();
});