const express = require('express');
const userroutes  = require('./routes/userroutes')
const app = express();
app.use(express.json());
app.use('/',userroutes);

module.exports  = app;