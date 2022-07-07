const express = require('express');
const router = express.Router();

const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")

router.post("/register", userController.createUser)

router.post("/login", userController.userLogin)

router.post("/books", bookController.createBook)

router.get("/books",bookController.getBooks)


router.all('/*', async function(req, res){
    res.status(404).send({status: false, msg: "Page Not Found!!!"})
})


module.exports = router;
