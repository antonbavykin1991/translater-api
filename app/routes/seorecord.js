const api = require('../utils/jsop-api')

module.exports = function(app, {
  models = {}
} = {}) {
  app.get('/seorecords', async (req, res) => {
    const {
      Seorecord
    } = models

    const result = await api.toJSONApi(Seorecord.find({}), req)

    res.send(result)
  });
};
