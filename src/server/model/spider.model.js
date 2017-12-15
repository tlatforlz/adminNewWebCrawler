var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var spiderSchema = new Schema({
  urlId: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'url'
  },
  name: {
    type: String,
    require: true
  },
  isSourceUpdated: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Number,
    default: 1,
  },
  updateDate: {
    type: Date,
    default: Date.now()
  },
  createDate: {
    type: Date,
    default: Date.now()
  },
  crawlingName: {
    type: String,
    require: true
  },
  spiderInformation: {
    title: {
      selector: String,
      remove: [String]
    },
    content: {
      selector: String,
      remove: [String]
    },
    author: {
      selector: String,
      remove: [String]
    },
    createDate: {
      selector: String,
      remove: [String]
    },
    image: {
      selector: String,
      remove: [String]
    },
    nextPage: {
      selector: String,
      remove: [String]
    },
    description: {
      selector: String,
      remove: [String]
    }
  }
});

var spider = mongoose.model('spider', spiderSchema);
module.exports = spider;
