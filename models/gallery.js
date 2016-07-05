var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gallerySchema = new Schema({
		url: String,
});

module.exports = gallerySchema;
