const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model(
  'Seorecord',
  Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    email: String,
    type: {
      type: String,
      default: 'seorecords'
    },
    translation: {
      type: Schema.Types.ObjectId,
      ref: 'Translation'
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: 'Image'
    },
  })
);
