var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
    type: String,
    name: String,
    email: String,
    phone: String,
		type: String
});

module.exports = contactSchema;
