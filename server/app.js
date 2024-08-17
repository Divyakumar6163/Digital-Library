const express = require("express");
const cors = require("cors");
const userroutes = require("./routes/userroutes");

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:5000",
      //   "https://divyakumar.github.io",
    ],
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/", userroutes);

module.exports = app;
