const express = require('express');
const router = express.Router();

const bookController = require("../controllers/bookController");
const userController = require("../controllers/userController");
const middlewares = require("../middlewares/auth")

router.get("/books",bookController.getBooks)


let { createUser, userLogin } = userController;
let { createBook, getBooks, getBooksById,deleteBook } = bookController;
let { authenticate, authorise } = middlewares;

// ==========> Create User Api <=============   
router.post("/register", createUser);

// ===========> Login User Api <=============   
router.post("/login", userLogin);

// ===========> Create Books Api <=============
router.post("/books", authenticate ,createBook);

// =============> Get Books Api <============
router.get("/books", authenticate ,getBooks);

// =============> Get Books By Id <============
router.get("/books/:bookId", authenticate , getBooksById);

// ===========> Delete Books Api <=============
router.delete("/books/:bookId", authenticate ,deleteBook);



module.exports = router;
