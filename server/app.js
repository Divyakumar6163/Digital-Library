const express = require("express");
const cors = require("cors");
const userroutes = require("./routes/userroutes");
const bookroutes = require("./routes/booksroutes");
const adminroutes = require("./routes/adminroute");
// const paymentroute = require("./routes/payment_route");
const cookieParser = require("cookie-parser");
const { storage } = require("./storage/storage");
const multer = require("multer");
const cron = require("node-cron");
const upload = multer({ storage });
const https = require("https");
const app = express();

app.use(cookieParser());

// var corsOptions = {
//   origin: "http://localhost:3000",
//   // origin:"https://digital-library-alpha.vercel.app/",
//   credentials: true,
// };
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://digital-library-alpha.vercel.app",
      "https://digital-library-cryf.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Enable pre-flight requests for all routes (Optional)
app.options("*", cors());

const backendUrl = "https://digital-library-cryf.onrender.com";
cron.schedule("*/180 * * * * *", function () {
  console.log("Restarting server");

  https
    .get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("Restarted");
      } else {
        console.error(`failed to restart with status code: ${res.statusCode}`);
      }
    })
    .on("error", (err) => {
      console.error("Error ", err.message);
    });
});

app.post("/upload", upload.single("image"), (req, res) => {
  console.log("Uploaded File:", req.file);
  console.log("Form Data:", req.body);

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  console.log("Uploaded File:", req.file);
  console.log("Form Data:", req.body);

  res.status(200).json({
    message: "File uploaded successfully!",
    fileUrl: req.file.path,
    public_id: req.file.filename,
    formData: req.body,
  });
});

app.use(express.json());
app.use("/", userroutes);
app.use("/", bookroutes);
app.use("/", adminroutes);
// app.use("/api", paymentroute);
module.exports = app;
