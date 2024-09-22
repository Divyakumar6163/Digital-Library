const express = require("express");
const admincontroller = require("./../controllers/admin/adminsontroller");
const authcontroller = require("./../controllers/admin/adminauth");
const router = express.Router();

router.get("/alladmin", admincontroller.getalladmin);

router.post("/admin/signup", admincontroller.createadmin);

router.post("/admin/login", admincontroller.adminlogin);
// router.post("/user/login", authcontroller.checkauth, usercontroller.userlogin);

router.get("/adminuser/:id", admincontroller.getadmininfo);

router.post("/adminreqresetpassword", authcontroller.requestresetuserpassword);

router.post("/adminresetpassword", authcontroller.resetpassword);

router.get("/admingetresettoken", authcontroller.getallresettoken);

module.exports = router;
