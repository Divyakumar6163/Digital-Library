const userSchema = require("../../models/usermodel");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const welcomeemail = require("../../utils/mails/welcomemail");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });
exports.profile = async (req, res) => {
  const { name, profileImage, phoneno, about, favoriteCategories } = req.body;
  console.log(req.body.about);
  try {
    let user = await userSchema.findByIdAndUpdate(req.body._id, {
      ...req.body,
      profileImage: profileImage,
      phoneno: phoneno,
      about: about,
      favoriteCategories: favoriteCategories,
      name: name,
    });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user = await userSchema.findById(req.body._id);
    console.log(user);
    res.status(200).json({
      status: "success",
      message: "User profile updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!Array.isArray(user.wishlistbooks)) {
      user.wishlistbooks = [];
    }
    if (user.wishlistbooks.includes(req.body.bookId)) {
      return res.status(400).json({ message: "Book is already in wishlist" });
    }
    user.wishlistbooks.push(req.body.bookId);
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Book added to wishlist",
      data: user.wishlistbooks,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!Array.isArray(user.wishlistbooks)) {
      user.wishlistbooks = [];
    }
    if (!user.wishlistbooks.includes(req.body.bookId)) {
      return res.status(400).json({ message: "Book is not in the wishlist" });
    }
    user.wishlistbooks = user.wishlistbooks.filter(
      (bookId) => bookId.toString() !== req.body.bookId
    );

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Book removed from wishlist",
      data: user.wishlistbooks,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
exports.getWishlistBooks = async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.userID).populate({
      path: "wishlistbooks",
    });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Wishlist books retrieved successfully",
      data: user.wishlistbooks,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
