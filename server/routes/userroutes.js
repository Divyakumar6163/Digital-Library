const express = require('express');
const usercontroller = require('./../controllers/usercontroller');

const router = express.Router();

router.get('/alluser' ,usercontroller.getallusers);

router.post('/createuser' , usercontroller.createUsers);

router.get('/getuser/:id' , usercontroller.getuserinfo);

module.exports = router;