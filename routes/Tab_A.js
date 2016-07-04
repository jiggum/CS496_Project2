var Contacs = require('../models/contacs.js');
module.exports = function(app)
{
    // GET ALL BOOKS
    app.get('/A/api/books', function(req,res){
        Contacs.find(function(err, books){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(books);
        })
    });
    app.get('/A', function(req,res){
        res.writeHead(200,{"Content-Type":"text/plain"});
        console.log("Saying Hello");
        res.write("Hello A");
        res.end();
    })
         
}
