const dotenv = require("dotenv");
const contactUs = require("../../models/contactUs");
const JWT = require("jsonwebtoken");
dotenv.config({ path: "./../config.env" });
const { promisify } = require("util");

exports.contactUs = async (req, res) => {
    try {
      const newContact = await contactUs.create(req.body);
      res.status(200).json({
        data: {
          contact: newContact,
        },
        message: "Your message has been sent successfully",
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "Error while sending message",
        error: err.message,
      });
    }
};