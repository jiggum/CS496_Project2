var Contacs = require('../models/user.js');
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
    app.get(PREFIX+'', function(req,res){
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.write("Hello A");
        res.end();
    })
         
}
