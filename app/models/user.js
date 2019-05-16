const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model(
  'User',
  Schema({
    _id: Schema.Types.ObjectId,

    type: {
      type: String,
      default: 'users'
    },

    name: String,

    image: {
      type: Schema.Types.ObjectId,
      ref: 'Image'
    }
  })
);
