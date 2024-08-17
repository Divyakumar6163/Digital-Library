const express = require('express');
const userroutes  = require('./routes/userroutes')
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use('/',userroutes);

module.exports  = app;