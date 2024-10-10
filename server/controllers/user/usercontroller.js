const userSchema = require('../../models/usermodel')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken');
const crypto = require('crypto')
const welcomeemail = require('../../utils/mails/welcomemail')
const dotenv = require('dotenv');
dotenv.config({ path: './../config.env' });
const catchAsync = require("./../../utils/catchAsync");
const { OAuth2Client } = require("google-auth-library");
const auth  = require('./authservice')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const AppError = require('./../../utils/apperror')
exports.getallusers = async (req, res) => {
    try {
        const alluser = await userSchema.find();
        return res.status(200).json({
            status: 'success',
            data: {
                alluser: alluser
            }
        })
    }
    catch (err) {
        return res.status(500).json({
            status: 'error',
            message: "Error While fetching data",
            error: err
        })
    }
}
exports.createUsers = async (req, res) => {
    try {
        const user = await userSchema.findOne({ emailid: req.body.emailid });
        if (user) {
            return res.status(500).json({
                message: "This email already exists please try with another email"
            })
        }
        const newuser = await userSchema.create(req.body);
        await welcomeemail({
            email: req.body.emailid,
            subject: "Welcome to Digi Library",
            name: req.body.name,
        })
        return res.status(201).json({
            status: 'success',
            data: {
                user: newuser
            }
        })
    }
    catch (err) {
        return res.status(500).json({
            status: 'error',
            message: "Error while creating users",
            error: err
        })
    }
}
exports.getuserinfo = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const userinfo = await userSchema.findById(id);
        console.log(userinfo)
        if (!userinfo) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        return res.status(200).json({
            status: 'success',
            data: {
                userinfo: userinfo
            },
            message: "User info available",

        })
    }
    catch (err) {
        return res.status(500).json({
            status: 'error',
            message: "Error while fetching user details",
            error: err
        })
    }
}
exports.userlogin = async (req, res) => {
    try {
        console.log(req.body)
        if (!req.body.emailid) {
            return res.status(404).json({
                message: 'please enter your email address'
            })
        }
        if (!req.body.password) {
            return res.status(404).json({
                message: 'please enter your password'
            })
        }
        const user = await userSchema.findOne({ emailid: req.body.emailid }).select("+password");
        console.log(user.password);
        if (!user) {
            return res.status(404).json({
                message: 'User not found with this email',
            })
        }
        const validuser = await bcrypt.compare(req.body.password, user.password)
        console.log(validuser)
        if (!validuser) {
            return res.status(404).json({
                message: 'Invalid password',
            })
        }
        return auth.createSendToken(validuser,201,res);
    }
    catch (err) {
        return res.status(500).json({
            message: "Login failed",
            error: err.message
        })
    }
}
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
            emailid = email
            password = email + "@#$";
            console.log(emailid, password);
            const userdetails = {
                name: name,
                emailid: email,
                password: password,
                profileImage: profileImage
            }
            // console.log(userdetails);
            user = await userSchema.create(userdetails);
            await welcomeemail({
                email: req.body.emailid,
                subject: "Welcome to Digi Library",
                name: req.body.name,
            })
            // console.log(user);
        } else {
            user.name = name;
            user.profileImage = profileImage;
            await user.save();
        }
        return auth.createSendToken(user,201,res);
    } catch (err) {
        return res.status(500).json({
            message: "Login failed",
            error: err.message
        })
    }
});

  