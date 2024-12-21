const Bookschema = require("../../models/bookmodel");
const dotenv = require("dotenv");
const userSchema = require('../../models/usermodel');
const Blacklisttoken = require('../../models/blacklisttoken');
const JWT = require("jsonwebtoken");
dotenv.config({ path: "./../config.env" });
const { promisify } = require("util");
const addCoAuthorEmail = require("../../utils/mails/addcoauthoremial")

exports.sendCoAuthorRequest = async (req, res) => {
    try {
      console.log("Starting to send co-author invitations...");
  
      const emailarr = req.body.emails;
      const book = await Bookschema.findById(req.body.bookid);
  
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      const currCoAuthors = book.coAuthors || [];
      const filteredEmails = emailarr.filter(email => !currCoAuthors.includes(email));
      const totalemails = filteredEmails.length;
  
      for (let i = 0; i < totalemails; i++) {
        const curuser = await userSchema.find({ emailid: filteredEmails[i] });
        if (curuser.length > 0) {
          const firstName = curuser[0].name.split(" ")[0];
          const InviteLink = JWT.sign(
            {
              bookid: req.body.bookid,
              userId: filteredEmails[i],
            },
            process.env.ACCESS_JWT_SECRET,
            {
              expiresIn: process.env.ACCESS_JWT_EXPIRES_IN,
            }
          );
          const link = `${process.env.FRONT_END_LINK}/addcoauthor/${InviteLink}`;
          await addCoAuthorEmail({
            email: filteredEmails[i],
            subject: "Invitation to Co-Author",
            name: firstName,
            inviteLink: link,
          });
          console.log(`Invitation sent to ${filteredEmails[i]} (First Name: ${firstName})`);
        } else {
          console.log(`No user found with email: ${filteredEmails[i]}`);
        }
      }
      res.status(200).json({
        status: "success",
        message: "Co-author invitations sent successfully!",
      });
    } 
    catch (err) {
      console.error("Error in sending co-author invitations:", err);
  
      res.status(500).json({
        status: "error",
        message: "Error while sending co-author invitations",
        error: err.message,
      });
    }
  };
  
  exports.acceptCoAuthorInvitation = async (req, res) => {
    try {
      const checkvalidtoken = await Blacklisttoken.findOne({ token: req.body.InviteLink });
      if (checkvalidtoken) {
        return res.status(400).json({ message: "Invite link has been blacklisted" });
      }
      const decoded = await promisify(JWT.verify)(
        req.body.InviteLink,
        process.env.ACCESS_JWT_SECRET
      );
      const book = await Bookschema.findById(decoded.bookid);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      const usermail = decoded.userId;
      if (book.coAuthors.includes(usermail)) {
        return res.status(400).json({ message: "User already a co-author of the book" });
      }
      book.coAuthors.push(usermail);
      await book.save();
      res.status(200).json({
        status: "success",
        message: "Co-author invitation accepted",
      });
    } 
    catch (err) {
      res.status(500).json({
        status: "error",
        message: "Error while accepting co-author invitation",
        error: err.message,
      });
    }
  };
  
  exports.declineCoAuthorInvitation = async (req, res) => {
    try {
      const existingBlacklist = await Blacklisttoken.findOne({ token: req.body.InviteLink });
      if (existingBlacklist) {
        return res.status(400).json({ message: "Invite link is already blacklisted." });
      }
  
      const decoded = await promisify(JWT.verify)(
        req.body.InviteLink,
        process.env.ACCESS_JWT_SECRET
      );
  
      const book = await Bookschema.findById(decoded.bookid);
      if (!book) {
        return res.status(404).json({ message: "Book not found." });
      }
      const blacklistedToken = new Blacklisttoken({ token: req.body.InviteLink });
      await blacklistedToken.save();
  
      res.status(200).json({
        status: "success",
        message: "Co-author invitation declined and invite link blacklisted.",
      });
    } 
    catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({ message: "Invite link has expired." });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(400).json({ message: "Invalid invite link." });
      }
  
      res.status(500).json({
        status: "error",
        message: "Error while declining co-author invitation",
        error: error.message,
      });
    }
  };
  
  exports.removeCoAuthor = async (req, res) => {
    try {
      const mail = req.body.mailId;
      const bookId = req.body.bookid;
  
      const book = await Bookschema.findById(bookId);
  
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      if (!book.coAuthors.includes(mail)) {
        return res.status(404).json({ message: "Co-author not found in this book" });
      }
  
      book.coAuthors = book.coAuthors.filter(coAuthor => coAuthor !== mail);
      await book.save();
  
      return res.status(200).json({
        message: "Co-author removed successfully",
      });
    } 
    catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Error while removing co-author",
        error: err.message,
      });
    }
  };