const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });

var Schema = mongoose.Schema;

const adminemailschema = new Schema({
  emailid: {
    type: "string",
    required: true,
    unique: true,
  }
});

const adminemail = mongoose.model("adminemail", adminemailschema);

module.exports = adminemail;
