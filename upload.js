var mongoose = require("mongoose");
var contacts = require("./models/contacts.js");

mongoose.connect("mongodb://localhost/test");

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
	console.log("MongoDB Connected");
	db.collections['contacts'].drop(function(err) {
		console.log('collection dropped');
	})
});

var gimun = new contacts({name: "Gimun",
						email: "gimunlee@kaist.ac.kr",
						phone: "010-8866-3321"});
console.log("Gimun's name is : " + gimun.name);
gimun.save(function (err, gimun) {
	if(err)
		return console.error(err);
});
