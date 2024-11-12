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
  profileImage: {
    type: String,
    default: "",
  },
  emailid: {
    type: "string",
    required: true,
    unique: true,
  },
  phoneno: {
    type: Number,
    // required: false,
  },
  password: {
    type: "string",
    required: true,
    select: false,
  },
  about: {
    type: String,
    default: "Write about yourself",
  },
  favoriteCategories: {
    type: Array,
    default: [],
    // enum: ["Fiction", "Non-Fiction", "Technology", "Sci-Fi"],
  },
  ispreminum: {
    type: "boolean",
    default: false,
  },
  purchedbooks: {
    type: Schema.ObjectId,
    ref: "Book",
  },
  wishlistbooks: [
    {
      type: Schema.ObjectId,
      ref: "Book",
    },
  ],
  lastLogin: {
    type: Date,
    default: Date.now,
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
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const user = mongoose.model("User", userSchema);

module.exports = user;
