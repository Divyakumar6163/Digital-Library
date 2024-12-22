const express = require("express");
const bookcontroller = require("./../controllers/book/bookcontroller");
const authcontroller = require("./../controllers/user/authservice");
const collabcontroller = require("./../controllers/book/collabreq")
const coauthorcontroller = require("./../controllers/book/coauthorreq")
const reviewercontroller = require("./../controllers/book/reviewerreq")
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
router.patch("/updateintro/:bookId", bookcontroller.updatebookintro);
router.delete("/deletebook/:bookId", bookcontroller.deletebook);
router.get("/book/:bookId", bookcontroller.getbookbyID);
router.get("/search", bookcontroller.searchBook);
router.get(
  "/mybooks",
  authcontroller.checkvaliduser,
  bookcontroller.getBookByUser
);

router.post("/getbookinfoytoken",bookcontroller.getbookinfo);

router.post("/invitecollaborators", authcontroller.checkvaliduser,collabcontroller.sendcollaboratorrequest)
router.post("/acceptcollab", authcontroller.checkvaliduser,collabcontroller.acceptcollabInvitation)
router.post("/removecollab", authcontroller.checkvaliduser,collabcontroller.removecollab)
router.post("/declinecollab", authcontroller.checkvaliduser,collabcontroller.declineinvitation)

router.post("/invitecoauthor", authcontroller.checkvaliduser,coauthorcontroller.sendCoAuthorRequest)
router.post("/acceptcoauthor", authcontroller.checkvaliduser,coauthorcontroller.acceptCoAuthorInvitation)
router.post("/removecoauthor", authcontroller.checkvaliduser,coauthorcontroller.removeCoAuthor)
router.post("/declinecoauthor", authcontroller.checkvaliduser,coauthorcontroller.declineCoAuthorInvitation)

router.post("/invitereviewer", authcontroller.checkvaliduser,reviewercontroller.sendReviewerRequest)
router.post("/acceptreviewer", authcontroller.checkvaliduser,reviewercontroller.acceptReviewerInvitation)
router.post("/removereviewer", authcontroller.checkvaliduser,reviewercontroller.removeReviewer)
router.post("/declinereviewer", authcontroller.checkvaliduser,reviewercontroller.declineReviewerInvitation)

module.exports = router;
