const userSchema = require("../../models/usermodel");
const DummyUser = require("../../models/unverifiedusermodel");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const verifyemail = require('../../utils/mails/verifyemailmail')
const crypto = require("crypto");
const welcomeemail = require("../../utils/mails/welcomemail");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });
const catchAsync = require("./../../utils/catchAsync");
const { OAuth2Client } = require("google-auth-library");
const auth = require("./authservice");
const { promisify } = require("util");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const AppError = require("./../../utils/apperror");
const validator = require('validator');
exports.getallusers = async (req, res) => {
  try {
    const alluser = await userSchema.find();
    return res.status(200).json({
      status: "success",
      data: {
        alluser: alluser,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error While fetching data",
      error: err,
    });
  }
};
exports.createUsers = async (req, res) => {
  try {
    const user = await userSchema.findOne({ emailid: req.body.emailid });
    if(!validator.isEmail(req.body.emailid)){
      return res.status(403).json({
        message: "Please enter valid email",
      });
    }
    if(user && !user.issetuppassword){
      const obj = {
        name : user.name,
        emailid: user.emailid,
        password : req.body.password
      };
      const newuser = await DummyUser.create(obj);
      // user.issetuppassword = true
      const newAccessToken = JWT.sign({ id: newuser._id }, process.env.ACCESS_JWT_SECRET, {
        expiresIn: process.env.ACCESS_JWT_EXPIRES_IN,
      });
      const link = `${process.env.FRONT_END_LINK}/verifyemail/${newAccessToken}`
          await verifyemail({
              email: obj.emailid,
              subject: "Verify your email",
              name: obj.name,
              verificationLink: link
          });
      return res.status(201).json({
        status: "Please verify your email",
        data: {
          user: user,
        },
      });
    }
    else{
      if (user) {
        return res.status(500).json({
          message: "This email already exists",
        });
      }
      const newuser = await DummyUser.create(req.body);
      // newuser.issetuppassword = true
      // await newuser.save();
      // await welcomeemail({
      //   email: req.body.emailid,
      //   subject: "Welcome to Digi Library",
      //   name: req.body.name,
      // });
      console.log(newuser)
      const newAccessToken = JWT.sign({ id: newuser._id }, process.env.ACCESS_JWT_SECRET, {
        expiresIn: process.env.ACCESS_JWT_EXPIRES_IN,
      });
      const link = `${process.env.FRONT_END_LINK}/verifyemail/${newAccessToken}`
          await verifyemail({
              email: newuser.emailid,
              subject: "Verify your email",
              name: newuser.name,
              verificationLink: link
          });
      return res.status(201).json({
        status: "Please verify your email",
        data: {
          user: newuser,
        },
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Error while creating users",
      error: err,
    });
  }
};
exports.verifyuseremail = async (req, res) => {
  // console.log(req.body.token);
    try {
      const decoded = await promisify(JWT.verify)(req.body.token, process.env.ACCESS_JWT_SECRET);
      // console.log(decoded);
      const userinfo = await DummyUser.findById(decoded.id)
      const exituser = await userSchema.find({emailid: userinfo.emailid})
      console.log(exituser[0]);
      if(exituser[0]){
          exituser[0].password = userinfo.password;
          exituser[0].issetuppassword = true;
          await exituser[0].save();
          return res.status(200).json({
            status: "eamil verifed ",
            // message: "Error while verifying user",
          });
      }
      console.log(userinfo);
      const user = {
        name: userinfo.name,
        password: userinfo.password,
        emailid: userinfo.emailid,
      }
      const newuser = await  userSchema.create(user);
      // await userinfo.remove();
      newuser.issetuppassword = true
    await newuser.save();
    await welcomeemail({
      email: user.emailid,
      subject: "Welcome to Digi Library",
      name: user.name,
    });
      return res.status(200).json({
        status: "eamil verifed ",
        // message: "Error while verifying user",
      });
    }
    catch (err) {
      return res.status(500).json({
        status: "error",
        message: err,
        error: err,
      });
    }
}
exports.getuserinfo = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const userinfo = await userSchema.findById(id);
    console.log(userinfo);
    if (!userinfo) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: {
        userinfo: userinfo,
      },
      message: "User info available",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error while fetching user details",
      error: err,
    });
  }
};
exports.userlogin = async (req, res) => {
  try {
    if (!req.body.emailid) {
      return res.status(400).json({
        message: "Please enter your email address",
      });
    }
    if (!req.body.password) {
      return res.status(400).json({
        message: "Please enter your password",
      });
    }
    const user1 = await userSchema.find({ emailid: req.body.emailid })
    if (!user1) {
      return res.status(404).json({
        message: "Your account does not exist",
      });
    }
    console.log(user1[0].issetuppassword)
    if(!user1[0].issetuppassword) {
      return res.status(404).json({
        message: "Plese set your password first through signup",
      });
    }
    const user = await userSchema
      .findOne({ emailid: req.body.emailid })
      .select("+password");
    if (!user) {
      return res.status(404).json({
        message: "Your account does not exist",
      });
    }
    const validuser = await bcrypt.compare(req.body.password, user.password);
    if (!validuser) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }
    return auth.createSendToken(user, 201, res);
  } catch (err) {
    return res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};

exports.googleLoginSignup = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload["email"].toLowerCase();
    const name = payload["name"];
    const profileImage = payload["picture"];
    console.log(email, name);
    let user = await userSchema.findOne({ emailid: email });
    console.log(user);
    if (!user) {
      emailid = email;
      // password = email + "@#$";
      // console.log(emailid, password);
      const userdetails = {
        name: name,
        emailid: email,
        // password: password,
        profileImage: profileImage,
      };
      // console.log(userdetails);
      user = await userSchema.create(userdetails);
      await welcomeemail({
        email: email,
        subject: "Welcome to Digi Library",
        name: name,
      });
      // console.log(user);
    } else {
      //   user.name = name;
      //   user.profileImage = profileImage;
      await user.save();
    }
    return auth.createSendToken(user, 201, res);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
});
