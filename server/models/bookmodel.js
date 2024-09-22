const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });

var Schema  = mongoose.Schema;
const ComponentSchema = new Schema({
    type: {
        type: String,
        enum: ['Heading', 'Text', 'Graph', 'Equation', 'Video', 'Image', 'Quote', 'FillInTheBlanks','MCQs'],
        required: true
    },
    content: {
        type: mongoose.Schema.Types.Mixed, 
        required: true
    },
    id: { 
        type: Number,
        required: true
    }
}, { _id: false });

const ChapterSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        default: ''
    },
    components: [ComponentSchema] 
});
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
    chapters: [ChapterSchema],
    tags:{
        type: Array,
        default:null,
    },
    summary:{
        type: "string",
        default: "",
    },
    booktype:{
        type: "string",
        enum:['Premium', 'Normal'],
        required: true
    },
    createdat: {
        type: Date,
        default: Date.now 
    }
})

const Book = mongoose.model("Book", Bookschema);

module.exports = Book;