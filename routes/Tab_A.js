var Contacs = require('../models/contacts.js');
var PREFIX = '/A';
module.exports = function(app)
{
    // GET ALL BOOKS
    app.get(PREFIX+'/api/books', function(req,res){
        Contacs.find(function(err, books){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(books);
        })
    });
    app.get(PREFIX+'/api/hello', function(req,res){
        res.writeHead(200,{"Content-Type":"text/plain"});
        console.log("hello");
        res.write("Hello A");
        res.end();
    });
    app.get(PREFIX+'/api/bye', function(req,res) {
        res.writeHead(200,{"Content-Type":"text/plain"});
        console.log("bye");
        res.write("Bye A");
        res.end();
    });
    app.get(PREFIX+'/contacts', function(req,res) {
        console.log("Sending sample data of size 2");
        res.write("[{\"name\":\"Gimun\", \"email\":\"gimunlee@kaist.ac.kr\", \"phone\":\"010-8866-3321\"},{\"name\":\"Dongmin\", \"email\":\"dongmin.seo@kaist.ac.kr\", \"phone\":\"010-seo-3321\"}]");
        res.end();
    })
}
