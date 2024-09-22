const adminschema = require('../../models/adminmodel')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken');
const crypto = require('crypto')
const welcomeemail = require('../../utils/mails/welcomemail')
const dotenv = require('dotenv');
dotenv.config({ path: './../config.env' });
exports.getalladmin = async (req, res) => {
    try {
        const alluser = await adminschema.find();
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

exports.createadmin = async (req, res) => {
    try {
        const user = await adminschema.findOne({ emailid: req.body.emailid });
        if (user) {
            return res.status(500).json({
                message: "This email already exists please try with another email"
            })
        }
        const newuser = await adminschema.create(req.body);
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

exports.getadmininfo = async (req, res) => {
    try {
        const id = req.params.id;
        const admininfo = await adminschema.findById(id);
        console.log(admininfo)
        if (!admininfo) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        return res.status(200).json({
            status: 'success',
            data: {
                admininfo: admininfo
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
exports.adminlogin = async (req, res) => {
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
        const admin = await adminschema.findOne({ emailid: req.body.emailid }).select("+password");
        console.log(admin.password);
        if (!admin) {
            return res.status(404).json({
                message: 'User not found with this email',
            })
        }
        const validuser = await bcrypt.compare(req.body.password, admin.password)
        console.log(validuser)
        if (!validuser) {
            return res.status(404).json({
                message: 'Invalid password',
            })
        }
        const token = JWT.sign({ emailid: admin.emailid, password: req.body.password }, process.env.JWT_SECRET_KEY);
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        })
        return res.status(200).json({
            message: "Login successful",
            data: admin
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Login failed",
            error: err.message
        })
    }
}
