const express = require("express");
const router = express.Router();

const bookController = require("../controllers/bookController");
const userController = require("../controllers/userController");
const reviewController = require("../controllers/reviewController");
const middlewares = require("../middlewares/auth");

let { createUser, userLogin } = userController;
let { createBook, getBooks, getBooksById, updateBook, deleteBook } =
  bookController;
let {createReview, updateReview, deleteReview } = reviewController;
let { authenticate, authorise } = middlewares;

// ==========> Create User Api <=============
router.post("/register", createUser);

// ==========> Login User Api <=============
router.post("/login", userLogin);

// ==========> Create Books Api <=============
router.post("/books", authenticate, authorise ,createBook);

// ==========> Get Books Api <============
router.get("/books", authenticate ,getBooks);

// ==========> Get Books By Id <============
router.get("/books/:bookId", authenticate, authorise, getBooksById);

// ==========> Update Books Api <=============
router.put("/books/:bookId", authenticate, authorise, updateBook);

// ==========> Delete Books Api <=============
router.delete("/books/:bookId", authenticate, authorise, deleteBook);

// ==========> Create Review Api <============= 
router.post("/books/:bookId/review", createReview);

// ==========> Update Review Api <============
router.put("/books/:bookId/review/:reviewId", updateReview);

// ==========> Delete Review Api <============
router.delete("/books/:bookId/review/:reviewId", deleteReview);


// ==========> This API is used for handling any invalid Endpoints <=========== 
  router.all("/*", async function (req, res) {
    res.status(404).send({ status: false, msg: "Page Not Found!!!" });
  });

module.exports = router;
