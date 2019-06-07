const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model(
  'User',
  Schema({
    type: {
      type: String,
      default: 'users'
    },

    name: String,

    firstName: String,

    lastName: String,

    email: String,

    password: String,

    image: {
      type: Schema.Types.ObjectId,
      ref: 'Image'
    }
  })
);
