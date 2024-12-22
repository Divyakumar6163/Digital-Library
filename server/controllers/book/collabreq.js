const Bookschema = require("../../models/bookmodel");
const dotenv = require("dotenv");
const userSchema = require('../../models/usermodel');
const Blacklisttoken = require('../../models/blacklisttoken');
const JWT = require("jsonwebtoken");
dotenv.config({ path: "./../config.env" });
const { promisify } = require("util");
const addcollaboratoremail = require("../../utils/mails/addcollaboratoremail")


exports.sendcollaboratorrequest = async (req, res) => {
    try {
      console.log("Starting to send collaborator invitations...");
  
      const emailarr = req.body.emails;
      const user = req.user;
      const book = await Bookschema.findById(req.body.bookid);
  
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      const currcollab = book.collaborators || [];
      const filteredEmails = emailarr.filter(email => !currcollab.includes(email));
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
          const link = `${process.env.FRONT_END_LINK}/addcollaborator/${InviteLink}`;
          console.log(InviteLink);
          await addcollaboratoremail({
            email: filteredEmails[i],
            subject: "Invitation for Collaboration",
            name: firstName,
            inviteLink: link,
          });
          console.log(`Invitation sent to ${filteredEmails[i]} (First Name: ${firstName})`);
        }
         else {
          console.log(`No user found with email: ${filteredEmails[i]}`);
        }
      }
      res.status(200).json({
        status: "success",
        message: "Invitations sent successfully!",
      });
    } 
    catch (err) {
      console.error("Error in sending collaborator invitations:", err);
  
      res.status(500).json({
        status: "error",
        message: "Error while sending invitations",
        error: err.message,
      });
    }
  };
  
  exports.sendReviewerRequest = async (req, res) => {
    try {
      console.log("Starting to send reviewer invitations...");
  
      const emailarr = req.body.emails;
      const user = req.user;
      const book = await Bookschema.findById(req.body.bookid);
  
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      const currReviewers = book.reviewers || [];
      const filteredEmails = emailarr.filter(email => !currReviewers.includes(email));
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
          const link = `${process.env.FRONT_END_LINK}/addreviewer/${InviteLink}`;
          await addReviewerEmail({
            email: filteredEmails[i],
            subject: "Invitation for Reviewing",
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
        message: "Reviewer invitations sent successfully!",
      });
    } 
    catch (err) {
      console.error("Error in sending reviewer invitations:", err);
  
      res.status(500).json({
        status: "error",
        message: "Error while sending reviewer invitations",
        error: err.message,
      });
    }
  };
  
  
  exports.acceptcollabInvitation = async (req, res) => {
    try {
      const checkvalidtoken = await Blacklisttoken.findOne({token:req.body.InviteLink})
      if(checkvalidtoken){
        return res.status(400).json({ message: "Invite link has been blacklisted" });
      }
      const decoded = await promisify(JWT.verify)(
        req.body.InviteLink,
        process.env.ACCESS_JWT_SECRET
      );
      console.log(decoded);
      const book = await Bookschema.findById(decoded.bookid);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      const usermail = decoded.userId;
      if(book.collaborators.includes(usermail)){
        return res.status(400).json({ message: "User already collaborating with the book" });
      }
      book.collaborators.push(usermail);
      await book.save();
      res.status(200).json({
        status: "success",
        message: "Invitation accepted",
      });
    } 
    catch (err) {
      res.status(500).json({
        status: "error",
        message: "Error while accepting invitation",
        error: err.message,
      });
    }
  }
  exports.declineinvitation = async (req, res) => {
    try {
      console.log("InviteLink")
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
        message: "Invitation declined and invite link blacklisted.",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({ message: "Invite link has expired." });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(400).json({ message: "Invalid invite link." });
      }
  
      res.status(500).json({
        status: "error",
        message: "Error while declining invitation",
        error: error.message,
      });
    }
  };
  
  exports.removecollab = async (req, res) => {
    try {
      const mail = req.body.mailId; 
      const bookId = req.body.bookid;
  
      const book = await Bookschema.findById(bookId);
  
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      if (!book.collaborators.includes(mail)) {
        return res.status(404).json({ message: "Collaborator not found in this book" });
      }
  
      book.collaborators = book.collaborators.filter(collab => collab !== mail);
      await book.save();
  
      return res.status(200).json({
        message: "Collaborator removed successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Error while removing collaborator",
        error: err.message,
      });
    }
  };
  