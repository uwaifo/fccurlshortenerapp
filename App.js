var mongoose = require("mongoose")
var Schema = mongoose.Schema;
var AutoIncrement = require('mongoose-sequence')(mongoose);

var UrlSchema = new Schema({
  original_url: {
    type: String,
    required:true
  },
  short_url: Number
});

UrlSchema.plugin(AutoIncrement, {inc_field: 'short_url'});

module.exports = mongoose.model('Url', UrlSchema);

