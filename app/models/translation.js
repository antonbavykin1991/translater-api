const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model(
  'Translation',
  Schema({
    _id: Schema.Types.ObjectId,
    type: {
      type: String,
      default: 'translations'
    },
    name: String,
    
    image: {
      type: Schema.Types.ObjectId,
      ref: 'Image'
    }
  })
);
