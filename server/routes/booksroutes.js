const express = require("express");
const bookcontroller = require("./../controllers/bookcontroller");
const router = express.Router();

router.get('/books' , bookcontroller.getallbook)

router.post('/createbook', bookcontroller.createbook)

router.get('/getalltags', bookcontroller.getalldistincttags)

router.patch('/updatebook/:bookId', bookcontroller.updatebookcontent)
router.get('/book/:bookId', bookcontroller.getbookbyID)

module.exports = router;