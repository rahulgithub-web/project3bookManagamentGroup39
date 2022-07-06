const express = require('express');
const router = express.Router();
const {createUser,loginUser} = require("../controllers/userController")
// const {authentication,authorization} = require("../middlewares/auth");

 // User routes
router.post('/register', createUser);
// router.post('/login', loginUser);

module.exports =  router;