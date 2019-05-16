const express = require('express');
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const models = require('./app/models')

mongoose.connect("mongodb://localhost:27017/example", { useNewUrlParser: true })

require('./app/routes')(app, {
  models
});

app.listen(port, () => {
  console.log('We are live on ' + port);
});
