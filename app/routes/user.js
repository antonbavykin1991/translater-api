const api = require('../utils/jsop-api')

module.exports = function(app, {
  models = {}
} = {}) {
  app.get('/users', async (req, res) => {
    const {
      User
    } = models

    const result = await api.toJSONApi(User.find({}), req)

    res.send(result)
  });
};
