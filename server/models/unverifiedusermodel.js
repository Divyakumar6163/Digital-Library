const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });
var Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: "string",
    required: true,
  },
  emailid: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    // select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires : process.env.RESET_TOKEN_EXPIRE_IN
}
});
const user = mongoose.model("Unverifiedusr", userSchema);

module.exports = user;
