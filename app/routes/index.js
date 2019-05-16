const user = require('./user');
const product = require('./product');
const seorecord = require('./seorecord');

module.exports = function(app, options) {
  user(app, options);
  product(app, options);
  seorecord(app, options);
};
