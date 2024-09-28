const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });

var Schema  = mongoose.Schema;

const ComponentSchema = new Schema({
    type: {
        type: String,
        enum: ['Heading', 'Text', 'Graph', 'Equation', 'Video', 'Image', 'Quote', 'FillInTheBlanks', 'MCQs'],
        required: true
    },
    id: { 
        type: Number,
        required: true
    }
}, { _id: false, discriminatorKey: 'type' });
const HeadingComponent = ComponentSchema.discriminator('Heading', new Schema({
    content: {
        type: String,
        required: true
    }
}, { _id: false }));
const TextComponent = ComponentSchema.discriminator('Text', new Schema({
    content: {
        type: String,
        required: true
    }
}, { _id: false }));
const GraphComponent = ComponentSchema.discriminator('Graph', new Schema({
    content: {
        type: Object,
        required: true
    }
}, { _id: false }));
const EquationComponent = ComponentSchema.discriminator('Equation', new Schema({
    content: {
        type: String, 
        required: true
    }
}, { _id: false }));
const VideoComponent = ComponentSchema.discriminator('Video', new Schema({
    content: {
        type: String,
        required: true
    }
}, { _id: false }));
const QuoteComponent = ComponentSchema.discriminator('Quote', new Schema({
    content: {
        type: String, 
        required: true
    },
    author: {
        type: String, 
        required: false
    }
}, { _id: false }));
const FillInTheBlanksComponent = ComponentSchema.discriminator('FillInTheBlanks', new Schema({
    content: {
        type: String,
        required: true
    },
    answers: {
        type: [String], 
        required: true
    }
}, { _id: false }));
const MCQsComponent = ComponentSchema.discriminator('MCQs', new Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String], 
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    }
}, { _id: false }));


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
        required: true,
        default:"Normal"
    },
    createdat: {
        type: Date,
        default: Date.now 
    },
    ispublised:{
        type: Boolean,
        default: false
    }
});

const Book = mongoose.model("Book", Bookschema);

module.exports = Book;