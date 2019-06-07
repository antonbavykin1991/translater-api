const api = require('../utils/jsop-api')

module.exports = function(app, {
  models = {}
} = {}) {
  app.get('/seorecords', async (req, res) => {
    const {
      Seorecord
    } = models

    const result = await Seorecord.find({}).populate({
      path: 'translation'
    })

    let included = {}

    const jsopApiResult = result.map(r => {
      return api.serializeModelToJSONApi(r, included)
    })

    res.send(api.queryParamsParser(req))
  });
};
