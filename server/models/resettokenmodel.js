const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv');
dotenv.config({ path: './../config.env'});
const tokenSchema  = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    token: {
        type: "string",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires : process.env.RESET_TOKEN_EXPIRE_IN
    }
})

module.exports  = mongoose.model('Token',tokenSchema);