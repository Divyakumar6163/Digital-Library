const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv');
dotenv.config({ path: './../config.env'});
const BlacklisttokenSchema  = new Schema({
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

const Blacklisttoken = mongoose.model('Blacklisttoken',BlacklisttokenSchema);

module.exports = Blacklisttoken;