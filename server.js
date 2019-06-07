const express = require('express');
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const models = require('./app/models')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const redis = require('redis');
const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
  db: 3
});

mongoose.connect("mongodb://localhost:27017/example", { useNewUrlParser: true })

redisClient.on('error', error => {
  console.log(`redis error; err=${error}`);
});

redisClient.on('connect', () => {
  console.log('redis connected');
});

redisClient.on('end', () => {
  console.log('redis disconnected');
});

app.use(bodyParser.json())
app.use(cookieParser())

require('./app/routes')(app, {
  models,
  redisClient
});

app.listen(port, () => {
  console.log('We are live on ' + port);
});
