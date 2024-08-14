const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    name :{
        type: 'string',
        required: true
    },
    emailid:{
        type: 'string',
        required: true,
        unique: true,
    },
    phoneno:{
        type: Number,
        required: true
    },
    password: {
        type: 'string',
        required: true,
    },
    ispreminum : {
        type: 'boolean',
        default: false
    }
})

const user = mongoose.model('User',userSchema);

module.exports = user;
