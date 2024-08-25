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
    unique: true,
  },
  phoneno: {
    type: Number,
    required: true,
  },
  password: {
    type: "string",
    required: true,
    select: false,
  },
  ispreminum: {
    type: "boolean",
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});

const user = mongoose.model("User", userSchema);

module.exports = user;
