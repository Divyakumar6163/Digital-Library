const {razorpayinstance } = require('./../../config/razorpay.config');
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" }); 
const crypto = require("crypto");
const userSchema = require("../../models/usermodel");
const { request } = require('http');
const Razorpaypaymentistant = razorpayinstance();
exports.createOrder = async (req,res) =>{
    console.log(req.body);
    const {premiumtype } = req.body;
    let amount;
    if(premiumtype=='3-month'){
        amount = 3;
    }
    else if(premiumtype=='6-month'){
        amount = 6;
    }
    else if(premiumtype=='12-month'){
        amount = 12;
    }
    else{
        return res.status(400).json({
            message: "Invalid premium type",
            success: false
        });
    }
    const option = {
        amount : amount*100,
        currency : "INR",
        receipt : "order_receipt"
    };
    console.log(option);
    try{
        Razorpaypaymentistant.orders.create(option,(err,order) =>{
            if(err){
                return res.status(500).json({
                    message: "Error while creating order",
                    error: err,
                    success: false
                });
            }
            return res.status(200).json({
                message: "Payment request created successfully",
                order: order,
                success: true
            });
        } )
    }
    catch(err){
        return res.status(500).json({
            message: "Error while creating payment request",
            error: err,
            sucess: false
        });
    }
}


exports.verifyPaymentRequest = async (req,res) => {
    const {payment_id, order_id, signature } = req.body;
    // const payment_response = await Razorpaypaymentistant.payments.fetch(razorpay_payment_id);

    const secret = process.env.key_secret;

    const hmac = crypto.createHmac('sha256', secret);

    hmac.update(order_id +'|' + payment_id);

    const expectedSignature = hmac.digest('hex');

    if(expectedSignature === signature){
        //process the payment here
        console.log(req.user)
        const user = await userSchema.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
              status: "error",
              message: "User not found.",
            });
        }
      
        user.ispreminum = true;
        await user.save();
        return res.status(200).json({
            message: "Payment successful",
            success: true
        });
    }
    else{
        return res.status(400).json({
            message: "Payment failed",
            success: false
        });
    }
}