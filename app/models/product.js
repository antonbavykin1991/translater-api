const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model(
  'Product',
  Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    email: String,
    type: {
      type: String,
      default: 'products'
    },

    seorecord: {
      type: Schema.Types.ObjectId,
      ref: 'Seorecord'
    },

    image: {
      type: Schema.Types.ObjectId,
      ref: 'Image'
    },

    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
  })
);
