const JWT = require('jsonwebtoken');
const resettokenSchema = require('../../models/resettokenmodel')
const userSchema = require('../../models/usermodel')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv');
const crypto = require("crypto");
const { promisify } = require("util");
dotenv.config({ path: './../config.env' });
const  catchAsync =  require('../../utils/catchAsync');
const email = require('../../utils/mails/resetpasswordmail')
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
        const link = `${process.env.FRONT_END_LINK}/${resettoken}/${user._id}`
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
    if (!token) {
        return next();
    }
    try {
        const data = JWT.verify(token, process.env.JWT_SECRET_KEY);
        req.body.emailid = data.emailid;
        req.body.password = data.password;
        return next();
    } catch {
        return res.sendStatus(403);
    }
}

const signToken = (id) => {
    const Accesstoken = JWT.sign(id, process.env.ACCESS_JWT_SECRET, {
      expiresIn: process.env.ACCESS_JWT_EXPIRES_IN,
    });
  
    const Refreshtoken = JWT.sign(id, process.env.REFRESH_JWT_SECRET, {
      expiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
    });
  
    console.log("AccessToken", Accesstoken);
    console.log("RefreshToken", Refreshtoken);
    return [Accesstoken, Refreshtoken];
  };
  
  exports.createSendToken = catchAsync(async (user, statusCode, res) => {
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });
    const [AccessToken, RefreshToken] = signToken({ id: user._id });
    console.log(AccessToken);
    user.password = undefined;
    res.status(statusCode).json({
      status: "success",
      AccessToken,
      RefreshToken,
      user: user,
    });
  });
  
  exports.checkaccesstoken = async (req, res, next) => {
    try {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
  
      if (!token) {
        return res.status(401).json({ message: 'You are not logged in. Token is missing.' });
      }
      const decoded = await promisify(JWT.verify)(token, process.env.ACCESS_JWT_SECRET);
      const currentUser = await userSchema.findById(decoded.id);
      if (!currentUser) {
        return res.status(401).json({ message: 'The user belonging to this token does not exist.' });
      }
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return res.status(401).json({ message: 'token session expired' });
      }
      res.status(200).json({
        status: 'success',
        data: {
          message: 'Login sucessfull!',
          user: currentUser,
        },
      });
    } catch (error) {
      console.log('Error verifying token:', error);
      return res.status(403).json({ message: 'Invalid user expired token' });
    }
  };

  exports.refreshAccessToken = async (req, res, next) => {
    try {
        console.log(req.body)
      const { token: refreshToken } = req.body;
        console.log(refreshToken)
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
      }

      const decoded = await promisify(JWT.verify)(refreshToken, process.env.REFRESH_JWT_SECRET);
      const currentUser = await userSchema.findById(decoded.id);
      if (!currentUser) {
        return res.status(401).json({ message: 'User not found' });
      }
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return res.status(401).json({ message: 'token expired' });
      }
      const newAccessToken = JWT.sign({ id: currentUser._id }, process.env.ACCESS_JWT_SECRET, {
        expiresIn: process.env.ACCESS_JWT_EXPIRES_IN,
      });
      res.status(200).json({
        status: 'success',
        accessToken: newAccessToken,
      });
    } catch (error) {
      console.error('Error refreshing access token:', error);
      res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
  };