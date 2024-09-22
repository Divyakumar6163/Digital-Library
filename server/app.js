const express = require("express");
const cors = require("cors");
const userroutes = require("./routes/userroutes");
const bookroutes  = require("./routes/booksroutes");
const adminroutes = require("./routes/adminroute")
const cookieParser = require("cookie-parser");
const { storage } = require('./storage/storage');
const multer = require('multer');
const upload = multer({ storage });
const app = express();

app.use(cookieParser());

var corsOptions = {
  origin: "http://localhost:3000",
  // origin:"https://digital-library-alpha.vercel.app/",
  credentials: true,
};

app.use(cors(corsOptions));
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }
  res.status(200).json({
      message: 'File uploaded successfully!',
      fileUrl: req.file.path,
      public_id: req.file.filename,
  });
});
app.use(express.json());
app.use("/", userroutes);
app.use("/", bookroutes);
app.use("/", adminroutes);
module.exports = app;
