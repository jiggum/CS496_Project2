var gallerySchema = require('../models/gallery.js');
var PREFIX = '/B';
var fs = require('fs');
var AWS = require('aws-sdk');
var mongoose = require('mongoose');
AWS.config.loadFromPath('./config.json');
/////test
var user_id = "gaianofc";

module.exports = function(app)
{
	app.post(PREFIX + '/upload', function(req, res) {
		user_id = req.query.fid; 
    console.log(req.files.image.originalFilename);
    console.log(req.files.image.path);

		var s3 = new AWS.S3();

    var bodystream = fs.createReadStream(req.files.image.path);

    var params = {
        'Bucket': 'berryseoul',
        'Key': 'uploads/images/' + user_id + "/" + req.files.image.originalFilename.replace("JPG","jpg"),
        'Body': bodystream,
     };

     //also tried with s3.putObject
     s3.upload(params, function(err, data){
        console.log('after s3 upload====', err, data);
     });
	});
	app.post(PREFIX + '/uploadsmall', function(req, res) {
		user_id = req.query.fid; 
    console.log(req.files.image.originalFilename);
    console.log(req.files.image.path);

		var s3 = new AWS.S3();

    var bodystream = fs.createReadStream(req.files.image.path);

    var params = {
        'Bucket': 'berryseoul',
        'Key': 'uploads/smallimages/' + user_id + "/" + req.files.image.originalFilename,
        'Body': bodystream,
     };

     //also tried with s3.putObject
     s3.upload(params, function(err, data){
        console.log('after s3 upload====', err, data);
     });
	
    galleryModel = mongoose.model(user_id + "gallery", gallerySchema, user_id);
    var sgallery = new galleryModel({
				url:"https://s3.ap-northeast-2.amazonaws.com/berryseoul/uploads/smallimages/"+ user_id + "/" + req.files.image.originalFilename,
        type:"image",
      });
    sgallery.save(); 
	});


	app.get(PREFIX+'/images', function(req,res){
		user_id = req.query.fid; 
		galleryModel = mongoose.model(user_id + "gallery", gallerySchema, user_id);
		galleryModel.find({type:"image"},{url:1,_id:0},function(err, imageList){
			if(err) return console.error(err);
			var json = "["+imageList+"]";
			res.write(json);
			res.end();
		});
		
	});

	app.post(PREFIX+'/delete', function(req, res){
		user_id = req.query.fid; 
    galleryModel = mongoose.model(user_id + "gallery", gallerySchema, user_id);
		console.log(req.body);
    galleryModel.remove({url:{$regex : '.*' + req.body.url + '.*'}},function(err){
			return err;
		});
		res.json({type: req.body.url});
    });
     
}
