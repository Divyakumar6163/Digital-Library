const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });

var Schema = mongoose.Schema;

const ComponentSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "Heading",
        "Text",
        "Graph",
        "Equation",
        "Video",
        "Image",
        "Quote",
        "FillInTheBlanks",
        "MCQs",
      ],
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
  { _id: false, discriminatorKey: "type" }
);

const HeadingComponent = ComponentSchema.discriminator(
  "Heading",
  new Schema(
    {
      content: {
        type: String,
        required: true,
      },
      locked: { type: Boolean, default: false },
    },
    { _id: false }
  )
);

const TextComponent = ComponentSchema.discriminator(
  "Text",
  new Schema(
    {
      content: {
        type: String,
        required: true,
      },
      locked: { type: Boolean, default: false },
    },
    { _id: false }
  )
);

const GraphComponent = ComponentSchema.discriminator(
  "Graph",
  new Schema(
    {
      content: {
        type: Object,
        required: true,
      },
      locked: { type: Boolean, default: false },
    },
    { _id: false }
  )
);

const EquationComponent = ComponentSchema.discriminator(
  "Equation",
  new Schema(
    {
      content: {
        type: String,
        required: true,
      },
      locked: { type: Boolean, default: false },
    },
    { _id: false }
  )
);
const ImageComponent = ComponentSchema.discriminator(
  "Image",
  new Schema(
    {
      content: {
        type: String,
        required: true,
      },
      locked: { type: Boolean, default: false },
    },
    { _id: false }
  )
);
const VideoComponent = ComponentSchema.discriminator(
  "Video",
  new Schema(
    {
      content: {
        type: String,
        required: true,
      },
      locked: { type: Boolean, default: false },
    },
    { _id: false }
  )
);

const QuoteComponent = ComponentSchema.discriminator(
  "Quote",
  new Schema(
    {
      content: {
        type: String,
        required: true,
      },
      author: {
        type: String,
        required: false,
      },
      // locked: { type: Boolean, default: false }
    },
    { _id: false }
  )
);
const QuizComponent = ComponentSchema.discriminator(
  "Quiz",
  new Schema(
    {
      content: {
        question: {
          type: String,
          required: true,
        },
        options: [
          {
            id: {
              type: Number,
              required: true,
            },
            value: {
              type: String,
              required: true,
            },
          },
        ],
        correctAnswer: {
          type: Number,
          required: true,
        },
      },
      locked: { type: Boolean, default: false },
    },
    { _id: false }
  )
);

const FillInTheBlanksComponent = ComponentSchema.discriminator(
  "FillInTheBlanks",
  new Schema(
    {
      content: {
        questions: {
          type: String,
          required: true,
        },
        answers: {
          type: [String],
          required: true,
        },
      },
      locked: { type: Boolean, default: false },
    },
    { _id: false }
  )
);
// const FillInTheBlanksComponent = ComponentSchema.discriminator('FillInTheBlanks', new Schema({
//     content: {
//         type: String,
//         required: true
//     },
//     answers: {
//         type: [String],
//         required: true
//     }
// }, { _id: false }));

const MCQsComponent = ComponentSchema.discriminator(
  "MCQs",
  new Schema(
    {
      question: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
        required: true,
      },
      correctAnswer: {
        type: String,
        required: true,
      },
      locked: { type: Boolean, default: false },
    },
    { _id: false }
  )
);

const ChapterSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    default: "",
  },
  components: [ComponentSchema],
});

const BookSchema = new Schema({
  booktitle: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  createdby: {
    type: Schema.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
    default: "",
  },
  creaters: {
    type: Array,
    default: [],
  },
  author: {
    type: String,
    default: "",
  },
  chapters: [ChapterSchema],
  tags: {
    type: Array,
    default: [],
  },
  summary: {
    type: String,
    default: "",
  },
  booktype: {
    type: String,
    enum: ["Premium", "Normal"],
    required: true,
    default: "Normal",
  },
  createdat: {
    type: Date,
    default: Date.now,
  },
  ispublished: {
    type: Boolean,
    default: null,
  },
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
