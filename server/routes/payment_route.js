const express = require("express");
const { createOrder, verifyPaymentRequest } = require("../controllers/payment_gateway/razorpay.controller");
const {checkvaliduser} = require('./../controllers/user/authservice')
const router = express.Router();

router.post('/create-order',checkvaliduser,createOrder)

router.post('/verify-payment',checkvaliduser,verifyPaymentRequest)

module.exports = router;