const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model(
  'Image',
  Schema({
    _id: Schema.Types.ObjectId,
    type: {
      type: String,
      default: 'images'
    },
    
    url: String,
  })
);
