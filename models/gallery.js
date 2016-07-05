var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gallerySchema = new Schema({
		url: String,
		type: String
});

module.exports = gallerySchema;
