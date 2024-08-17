const express = require("express");
const usercontroller = require("./../controllers/usercontroller");
const authcontroller = require("./../controllers/authservice");
const router = express.Router();

router.get("/alluser", usercontroller.getallusers);

router.post("/user/signup", usercontroller.createUsers);

router.post("/user/login", authcontroller.checkauth, usercontroller.userlogin);

router.get("/getuser/:id", usercontroller.getuserinfo);

router.post("/reqresetpassword", authcontroller.requestresetuserpassword);

router.post("/resetpassword", authcontroller.resetpassword);

router.get("/getresettoken", authcontroller.getallresettoken);

module.exports = router;
