var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var book2Schema = new Schema({
    title: String,
    author: String,
    published_date: { type: Date, default: Date.now  }
});

module.exports = mongoose.model('book2', book2Schema);
