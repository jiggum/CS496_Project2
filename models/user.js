var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var gallerySchema = require('./gallery'); 
var contactsSchema = require('./contacts'); 
var userSchema = new Schema({
		fid: String,
		gallery:[gallerySchema],
    contacts:[contactsSchema],
});

module.exports = mongoose.model('user', userSchema);
