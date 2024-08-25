const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });

var Schema  = mongoose.Schema;

const Bookschema  = new Schema({
    booktitle : {
        type: "string",
        required: true
    },
    cratedby : {
        type : Schema.ObjectId,
        ref:"User"
    },
    description : {
        type: "string",
        default: "",
    },
    creaters:{
        type :Array,
        default:null,
    },
    author:{
        type : "string",
        default: "",
    },
    chapters:{
        type:Array,
        default:null,
    },
    tags:{
        type: Array,
        default:null,
    }

})

const Book = mongoose.model("Book", Bookschema);

module.exports = Book;