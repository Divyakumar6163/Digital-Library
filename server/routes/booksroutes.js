const express = require("express");
const bookcontroller = require("./../controllers/bookcontroller");
const authcontroller = require("./../controllers/user/authservice");
const router = express.Router();

router.get("/books", bookcontroller.getallbook);

router.post(
  "/createbook",
  authcontroller.checkvaliduser,
  bookcontroller.createbook
);

router.get("/getalltags", bookcontroller.getalldistincttags);
router.patch("/publishbook/:bookId", bookcontroller.publishbookuser);
router.patch("/updatebook/:bookId", bookcontroller.updatebookcontent);
router.delete("/deletebook/:bookId", bookcontroller.deletebook);
router.get("/book/:bookId", bookcontroller.getbookbyID);
router.get(
  "/mybooks",
  authcontroller.checkvaliduser,
  bookcontroller.getBookByUser
);

module.exports = router;
