const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");

let {
  isEmpty,
  isValidName,
  isValidObjectId,
} = require("../validator/validator");

// ==========> Create Review Api <==============
const createReview = async function (req, res) {
  try {
    let bookId = req.params.bookId;

    if (!bookId) {
      return res
        .status(404)
        .send({ status: false, message: "Enter a valid book id" });
    }

    let checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false });

    if (!checkBook) {
      return res
        .status(404)
        .send({ status: false, message: "Book is not available" });
    }
    let data = req.body;
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "All fields are mandatory!" });
    }
    let { rating, reviewedBy, review } = data;
    if (!isEmpty(rating)) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "Please provide valid rating between 1 and 5 only",
        });
    }
    if (rating) {
      if (!(rating >= 1 && rating <= 5)) {
        return res.status(400).send({
          status: false,
          message: "Please provide valid rating between 1 and 5 only",
        });
      }
    }
    if (reviewedBy) {
      if (!isEmpty(reviewedBy)) {
        return res
          .status(400)
          .send({ status: false, message: "Reviewed Name must be present" });
      }
      if (!isValidName(reviewedBy)) {
        return res.status(400).send({
          status: false,
          message: "Provide a valid Name(only alphabets allowed",
        });
      }
    }
    if (!isValidName(review)) {
      return res
        .status(400)
        .send({ status: false, message: "Review must be present" });
    }
    if (!isEmpty(data.bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "BookId must be present" });
    }
    if (!isValidObjectId(data.bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "It should be a valid bookId" });
    }

    const getReview = await reviewModel.create(data);

    await bookModel.findOneAndUpdate(
      { _id: bookId, isDelete: false },
      { $inc: { reviews: 1 } }
    );

    let finalData = await reviewModel
      .find(getReview)
      .select({ isDeleted: 0, updatedAt: 0, createdAt: 0, __v: 0 });

    let { ...checkBooks } = checkBook;
    checkBooks._doc.reviewesData = finalData;
    return res.status(201).send({
      status: true,
      message: "Review added successfully",
      data: checkBooks._doc,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// ===========> Update Api <=============
const updateReview = async (req, res) => {
  try {
    let data = req.body;
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;
    if (!isValidObjectId(bookId)) {
      return res.status(400).send({ status: false, message: "Invalid bookId" });
    }

    if (!isValidObjectId(reviewId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid reviewId" });
    }
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "All fields are menditory" });
    }

    let checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!checkBook) {
      return res
        .status(404)
        .send({ status: false, message: "Provide a valid bookId" });
    }
    let checkReview = await reviewModel.findOne({
      _id: reviewId,
      isDeleted: false,
    });
    if (!checkReview) {
      return res
        .status(404)
        .send({ status: false, message: "Provide a valid reviewId" });
    }
    let { review, reviewedBy, rating } = data;
    if (rating) {
      if (!(rating >= 1 && rating <= 5)) {
        return res.status(400).send({
          status: false,
          message: "Please provide valid rating between 1 and 5 only",
        });
      }
    }
    if (!isValidName(reviewedBy)) {
      return res.status(400).send({
        status: false,
        message: "Provide a valid name(only alphabets allowed)",
      });
    }
    if (!isValidName(review)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid review" });
    }
    let updatedReview = await reviewModel.findOneAndUpdate(
      { _id: reviewId, bookId: bookId, isDeleted: false },
      { review: review, rating: rating, reviewedBy: reviewedBy },
      { new: true }
    );

    let { ...updatedBook } = checkBook;
    updatedBook._doc.reviewesData = updatedReview;
    res.status(200).send({
      status: true,
      message: "Successfully updated Review Details",
      data: updatedBook._doc,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// =========> Delete Api <=============
const deleteReview = async function (req, res) {
  try {
    let reviewId = req.params.reviewId;
    let bookId = req.params.bookId;

    let checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false });

    if (!isValidObjectId(checkBook))
      return res
        .status(404)
        .send({ status: false, msg: "This bookId does not exist" });

    let checkReview = await reviewModel.findOne({ _id: reviewId });

    if (!isValidObjectId(checkReview))
      return res.status(404).send({ status: false, msg: "Invalid reviewId" });

    if (checkReview.isDeleted == true) {
      return res.status(400).send({ status: false, msg: "Already deleted!" });
    }

    let updateReviewDetails = await reviewModel.findOneAndUpdate(
      { _id: reviewId, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );

    await bookModel.findOneAndUpdate(
      { _id: bookId, isDeleted: false },
      { $inc: { reviews: -1 } }
    );

    res.status(200).send({
      status: true,
      msg: "Review data has been deleted successfully",
      data: updateReviewDetails,
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.createReview = createReview;
module.exports.deleteReview = deleteReview;
module.exports.updateReview = updateReview;
