const express = require("express");
const bookcontroller = require("./../controllers/bookcontroller");
const router = express.Router();

router.get('/books' , bookcontroller.getallbook)

router.post('/createbook', bookcontroller.createbook)

router.get('/getalltags', bookcontroller.getalldistincttags)

router.patch('/updatebook/:bookId', bookcontroller.updatebookcontent)

module.exports = router;