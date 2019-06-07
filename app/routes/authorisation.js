const api = require('../utils/jsop-api')
const md5 = require('md5');

module.exports = function(app, {
  models = {},
  redisClient
} = {}) {
  app.get('/check_auth', async (req, res) => {
    res.send({
      ok: 1
    })
  });

  app.post('/auth', async (req, res) => {
    console.log(req.cookies)

    res.send({
      ok: 1
    })
  })

  app.post('/sign_up', async (req, res) => {
    const {
      email,
      password
    } = req.body

    if (!email || !password) {
      return res
        .status(422)
        .send({
          errors: [
            {
              status: "422",
              source: {
                pointer: "/data/attributes/firstName"
              },
              title:  "Invalid Attribute",
              detail: "First name must contain at least three characters."
            }
          ]
        })
    }

    const {
      User
    } = models

    const user = new User({
      email,
      password: md5(password)
    })

    await user.save()

    const sessionId = md5(new Date())
    const userId = user.get('_id')
    const exp = 1000 * 60 * 24 * 3

    await new Promise((resolve, reject) => {
      redisClient.set(sessionId, userId, 'EX', exp, (err, reply) => {
        if (err) {
          return reject(err)
        }

        return resolve(reply)
      })
    })

    res.send({
      sessionId,
      userId
    })
  });
};
