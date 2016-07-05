var gallery = require('../models/gallery.js');
var PREFIX = '/B';
var fs = require('fs');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

module.exports = function(app)
{
	app.post('/upload', function(req, res) {
    console.log(req.files.image.originalFilename);
    console.log(req.files.image.path);

		var s3 = new AWS.S3();

    var bodystream = fs.createReadStream(req.files.image.path);

    var params = {
        'Bucket': 'berryseoul',
        'Key': 'uploads/images/' + req.files.image.originalFilename,
        'Body': bodystream,
     };

     //also tried with s3.putObject
     s3.upload(params, function(err, data){
        console.log('after s3 upload====', err, data);
     }) 
});
/*
    // GET ALL BOOKS
    app.get(PREFIX+'/api/books', function(req,res){
        gallery.find(function(err, books){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(books);
        })
    });

    // GET SINGLE BOOK
    app.get(PREFIX+'/api/books/:book_id', function(req, res){
        gallery.findOne({_id: req.params.book_id}, function(err, book){
            if(err) return res.status(500).json({error: err});
            if(!book) return res.status(404).json({error: 'book not found'});
            res.json(book);
        })
    });

    // GET BOOK BY AUTHOR
    app.get(PREFIX+'/api/books/author/:author', function(req, res){
        gallery.find({author: req.params.author}, {_id: 0, title: 1, published_date: 1},  function(err, books){
            if(err) return res.status(500).json({error: err});
            if(books.length === 0) return res.status(404).json({error: 'book not found'});
            res.json(books);
        })
    });

    // CREATE BOOK
    app.post(PREFIX+'/api/books', function(req, res){
        var book = new gallery();
        book.title = req.body.title;
        book.author = req.body.author;
        book.published_date = new Date(req.body.published_date);

        book.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }

            res.json({result: 1});

        });
    });

    // UPDATE THE BOOK
    app.put(PREFIX+'/api/books/:book_id', function(req, res){
        gallery.update({ _id: req.params.book_id }, { $set: req.body }, function(err, output){
            if(err) res.status(500).json({ error: 'database failure' });
            console.log(output);
            if(!output.n) return res.status(404).json({ error: 'book not found' });
            res.json( { message: 'book updated' } );
        })
    /* [ ANOTHER WAY TO UPDATE THE BOOK ]
            gallery.findById(req.params.book_id, function(err, book){
            if(err) return res.status(500).json({ error: 'database failure' });
            if(!book) return res.status(404).json({ error: 'book not found' });
            if(req.body.title) book.title = req.body.title;
            if(req.body.author) book.author = req.body.author;
            if(req.body.published_date) book.published_date = req.body.published_date;
            book.save(function(err){
                if(err) res.status(500).json({error: 'failed to update'});
                res.json({message: 'book updated'});
            });
        });
    });

    // DELETE BOOK
    app.delete(PREFIX+'/api/books/:book_id', function(req, res){
        gallery.remove({ _id: req.params.book_id }, function(err, output){
            if(err) return res.status(500).json({ error: "database failure" });

            /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
            if(!output.result.n) return res.status(404).json({ error: "book not found" });
            res.json({ message: "book deleted" });

            res.status(204).end();
        })
    });
*/
     
}
