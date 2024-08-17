const JWT = require('jsonwebtoken');
const resettokenSchema = require('./../models/resettokenmodel')
const userSchema = require('./../models/usermodel')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv');
const crypto = require("crypto");
dotenv.config({ path: './../config.env' });
const email = require('./../utils/mails/resetpasswordmail')
const bcryptsalt = process.env.BCRYPT_SALT
exports.requestresetuserpassword = async (req, res) => {
    try {
        console.log(req.body.emailid);
        const user = await userSchema.findOne({ emailid: req.body.emailid });
        if (!user) {
            res.status(404).json({
                message: "User not exist",
            })
        }
        let token = await resettokenSchema.findOne({ userId: user._id })
        if (token) {
            await token.deleteOne();
        }
        let resettoken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resettoken, 12);
        await new resettokenSchema({
            userId: user._id,
            token: hash,
            createdAt: Date.now()
        }).save();
        const link = `http://localhost:3000/${resettoken}/${user._id}`
        await email({
            email: user.emailid,
            subject: "Reset Password",
            name: user.name,
            resetLink: link
        });
        res.status(200).json({
            message: "link is send to your email",
            data: {
                userId: user._id,
                token: resettoken,
                createdAt: Date.now()
            }
        })
    }
    catch (err) {
        res.status(404).json({
            message: "Error during sending email",
            error: err
        })
    }
}

exports.resetpassword = async (req, res) => {
    try {
        const userId = req.body.userId;
        const token = req.body.token;
        const password = req.body.password;

        let passwordtoken = await resettokenSchema.findOne({ userId: userId });
        if (!passwordtoken) {
            return res.status(404).json({
                message: "Invalid link to reset password, please try again later."
            });
        }

        const isValidUser = await bcrypt.compare(token, passwordtoken.token);
        console.log(isValidUser);

        if (!isValidUser) {
            return res.status(404).json({
                message: "Invalid link to reset password, please try again later."
            });
        }
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        await userSchema.updateOne(
            { _id: userId },
            { $set: { password: hash } },
            { new: true }
        );

        await passwordtoken.deleteOne();
        res.status(200).json({
            message: "Password reset successfully.",
            data: {
                userId: userId,
                newpassword: hash,
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Error resetting password.",
            error: err,
        });
    }
};
exports.getallresettoken = async (req, res) => {
    try {
        const alltokens = await resettokenSchema.find();
        res.status(200).json({
            message: "All tokens found",
            data: {
                alltokens: alltokens
            }
        })
    }
    catch (err) {
        res.status(500).json({
            message: "error while getting tokens",
            error: err,
        })

    }
}

exports.checkauth = async (req, res, next) => {
    const token = req.cookies.access_token;
    console.log(token)
    if (!token) {
        return next();
    }
    try {
        const data = JWT.verify(token, process.env.JWT_SECRET_KEY);
        console.log(data)
        req.body.emailid = data.emailid;
        req.body.password = data.password;
        return next();
    } catch {
        return res.sendStatus(403);
    }
}