var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restrictSchema = new Schema({
  name: {
    type: String
  },
  level: {
    type: Number,
    default: 1
  }
})

var restrict = mongoose.model('restrict', restrictSchema);
module.exports = restrict;
