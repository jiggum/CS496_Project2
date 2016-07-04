var Contacs = require('../models/contacs.js');
var PREFIX = '/A'
module.exports = function(app)
{
    // GET ALL BOOKS
    app.get(PREFIX+'/api/books', function(req,res){
        Contacs.find(function(err, books){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(books);
        })
    });
    app.get(prefix+'/api/hello', function(req,res){
        res.writeHead(200,{"Content-Type":"text/plain"});
        console.log("hello");
        res.write("Hello A");
        res.end();
    });
    app.get(prefix+'/api/bye', function(req,res) {
        res.writeHead(200,{"Content-Type":"text/plain"});
        console.log("bye");
        res.write("Bye A");
        res.end();
    });
}
