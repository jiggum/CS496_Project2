var User = require('../models/user.js');
var Contact = require('../models/contacts.js');
var PREFIX = '/A';
module.exports = function (app) {
    app.get(PREFIX + '/api/hello', function (req, res) {
        var fid = req.query.fid;
        var helloStr ="Hello, " + fid + ". This is A" 
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
        var json = User.findOne({fid:req.query.fid},function (err, user) {
            res.write(user.contacts);
            res.end();
        })
    });
    app.post(PREFIX + '/contacts', function (req, res) {
        User.findOneAndUpdate({fid:req.query.fid},
                            {$set: {contacts:req.body.toString()}});
        res.writeHead(201);
        console.log(req.body.toString());
        res.write("Updated with posted json");
        res.end()
    });
}
