var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
    name: String,
    email: String,
    phone: String
    // phone: { type: Date, default: Date.now  }
});

// module.exports = mongoose.model('book', bookSchema);
module.exports = contactSchema;
