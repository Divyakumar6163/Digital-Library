const express = require("express");
const cors = require("cors");
const userroutes = require("./routes/userroutes");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());

var corsOptions = {
  origin: "http://localhost:3000",
  // origin:"https://digital-library-alpha.vercel.app/",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/", userroutes);

module.exports = app;
