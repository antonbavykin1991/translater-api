const user = require('./user');
const product = require('./product');
const seorecord = require('./seorecord');
const authorisation = require('./authorisation');

module.exports = function(app, options) {
  user(app, options);
  product(app, options);
  seorecord(app, options);
  authorisation(app, options);
};
