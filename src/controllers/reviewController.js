const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");

let {
  isEmpty,
  isValidName,
  isValidObjectId,
} = require("../validator/validator");
const createReview = async function (req, res) {
  try {
    let bookId = req.params.bookId;

    if (!bookId) {
      return res
        .status(404)
        .send({ status: false, message: "Enter a valid book id" });
    }

    let checkBook = await bookModel.findOne(
      { _id: bookId },
      { isDeleted: false }
    );
    if (!checkBook)
      return res
        .status(400)
        .send({ status: false, message: "Book is not available" });
    let data = req.body;
    if (Object.keys(data).length == 0) {
        return res
          .status(400)
          .send({ status: false, msg: "All fields are mandatory!" });
      }
    let { rating, reviewedBy, review } = data;
    if (!rating) {
      return res
        .status(400)
        .send({
          status: false,
          message:
            "Rating is required it should not be 0 it must be between 1 and 6",
        });
    }
    if (!isEmpty(reviewedBy)) {
      return res
        .status(400)
        .send({ status: false, message: "Reviewed Name must be present" });
    }
    if (!isValidName(reviewedBy)) {
      return res.status(400).send({ status: false, message: "" });
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

    await bookModel.findOneAndUpdate({_id: bookId, isDelete: false}, {$inc: {reviews: 1}})

    let finalData = await reviewModel.find(getReview).select({ isDeleted: 0, updatedAt: 0, createdAt: 0, __v: 0 });
    return res
      .status(201)
      .send({
        status: true,
        message: "Review added successfully",
        data: finalData,
      });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// =========> Delete Api <=============
const deleteReview = async function (req, res) {
    try {
      let reviewId = req.params.reviewId;
      let bookId = req.params.bookId
  
      let checkBook = await bookModel.findOne({_id: bookId, isDeleted: false})
console.log(checkBook)
      let {review} = checkBook;
      console.log(review);
  
      if (!isValidObjectId(checkBook)) 
      return res.status(404).send({status: false, msg: "This bookId does not exist"})
  
      let checkReview = await reviewModel.findOne({_id: reviewId})
  
       if (checkReview.isDeleted == true) {
        return res.status(400).send({status: false, msg: "Already deleted!"})
      }
  
      if (!isValidObjectId(checkReview))
      return res.status(404).send({status: false, msg: "Invalid reviewId"})
  
     
  
      let updateReviewDetails = await reviewModel.findOneAndUpdate({_id: reviewId, isDeleted: false},
        {$set: {isDeleted: true, deletedAt: Date.now()}}, {new: true }
        )
  
        if (updateReviewDetails){
        let updatedCount = await bookModel.findOneAndUpdate({_id: checkBook._id, isDeleted: false}, {$inc: {reviews: - 1}})
  
        if (!updatedCount)
        return res.status(400).send({status: false, msg: "Reviews not found"})
        }
      
      res.status(200).send({
        status: true,
        msg: "Review data has been deleted successfully",
        data: updateReviewDetails,
      });
    } 
    
    catch (error) {
      return res.status(500).send({ status: false, msg: error.message });
    }
  };

module.exports.createReview = createReview;
module.exports.deleteReview = deleteReview;
