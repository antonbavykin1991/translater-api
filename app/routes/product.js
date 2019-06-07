const api = require('../utils/jsop-api')

module.exports = function(app, {
  models = {}
} = {}) {
  app.get('/products', async (req, res) => {
    const {
      Product
    } = models

    const page = parseInt(req.query.page || 1)
    const per = parseInt(req.query.per || 10)
    const query = {}

    const result = await api.toJSONApi(Product
      .find(query)
      .limit(per)
      .skip((page - 1) * per)
    , req)

    const total_count = await Product.countDocuments(query)
    const hasRest = total_count % per ? 1 : 0

    result.metadata = {
      pagination: {
        per,
        page,
        total_page_count: parseInt(total_count / per) + hasRest,
        total_count
      }
    }

    res.send(result)
  });
};
