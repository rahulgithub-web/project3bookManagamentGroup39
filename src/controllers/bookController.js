const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const validation = require("../validator/validator");
const reviewModel = require("../models/reviewModel");


let { isEmpty, isValidObjectId, isValidISBN, isValidExcerpt, isValidName } =
  validation;

// ===========> Create Book Api <==============
const createBook = async function (req, res) {
  try {
    const data = req.body;
  
  
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "All fields are mandatory!" });
    }

    let { title, excerpt, userId, ISBN, category, subcategory } = data;
    if (!isEmpty(title)) {
      return res
        .status(400)
        .send({ status: false, message: "title should be present" });
    }
    if (!isEmpty(excerpt)) {
      return res
        .status(400)
        .send({ status: false, message: "excerpt should be present" });
    }
    if (!isEmpty(category)) {
      return res
        .status(400)
        .send({ status: false, message: "category should be present" });
    }
    if (!isEmpty(subcategory)) {
      return res
        .status(400)
        .send({ status: false, message: "subcategory should be present" });
    }
    if (!isEmpty(ISBN)) {
      return res
        .status(400)
        .send({ status: false, message: "ISBN should be present" });
    }
    if (!isValidISBN(ISBN)) {
      return res
        .status(400)
        .send({ status: false, message: "ISBN should follow 13 digit number" });
    }
    if (!isValidExcerpt(excerpt)) {
      return res.status(400).send({
        status: false,
        message: "excerpt should be in alphabatical order",
      });
    }
    let checkTitle = await bookModel.findOne({ title: title });
    if (checkTitle) {
      return res
        .status(400)
        .send({ status: false, message: "Title already exist" });
    }
    let checkingId = await userModel.findOne({
      userId: userId,
      isDelete: false,
    });

    if (!isValidObjectId(checkingId)) {
      return res
        .status(400)
        .send({ status: false, message: "User with this userId is invalid" });
    }
    let checkISBN = await bookModel.findOne({ ISBN: ISBN });
    if (checkISBN) {
      return res
        .status(400)
        .send({ status: false, message: "ISBN already exist" });
    }
    data.releasedAt = new Date().toLocaleString() 
    let savedData = await bookModel.create(data);

    return res.status(201).send({
      status: true,
      msg: "Book Model has been created successfully",
      data: savedData,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

// ============> Get Books Api <=============

//------------------------------get Book by queryParams------------------------------------------->

const getBooks = async (req, res) => {
  try {

    //<------Acquiring UserId from Decoded Token------->//
    let validAuthorId = req.tokenId;
    

    if (Object.keys(req.query) == 0) {
      let blog = await bookModel.find({ userId: validAuthorId, isDeleted: false })
      if (blog.length == 0) return res.status(404).send({ status: false, msg: "No Blog Found!!!" })
      return res.status(200).send({ status: true, msg: blog })
    }

    let { userId, category, subcategory } = req.query;
    let Objectid =isValidObjectId(userId)

    let addObj = { isDeleted: false}
    addObj.userId = validAuthorId;

    if (!Objectid) {
      return res.status(400).send({ status: false, msg: "user is Not Valid !" })
    }


    
    if (category) {
      addObj.category = category;
    }
    if (subcategory) {
      addObj.subcategory = subcategory
    }
    let showData = {
            _id: 1,
            title: 1,
            excerpt: 1,
            userId: 1,
            category: 1,
            reviews: 1,
            releasedAt: 1,
          };
    let book = await bookModel.find(addObj).select(showData) .sort({ title: 1 });

    if (book.length == 0) return res.status(404).send({ status: false, msg: "Book Not Found." })
    return res.status(200).send({ status: true, data: book })
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.getBooks = getBooks;


// ============> Get Books By Id(Api) <=============
const getBooksById = async function (req, res) {
  try {
    const bookId = req.params.bookId;

    if (!isValidObjectId(bookId)) {
      return res.status(404).send({
        status: false,
        message: "Invalid BookId",
      });
    }
    const checkBook = await bookModel
      .findOne({
        _id: bookId,
        isDeleted: false,
      })
      .select({ __v: 0, ISBN: 0 });
    if (!checkBook) {
      return res.status(404).send({ status: false, message: "No Book Found" });
    }
    const checkReview = await reviewModel.find({
      bookId: bookId,
      isDeleted: false,
    });

    checkBook._doc.reviewsData = checkReview;

    return res
      .status(200)
      .send({ status: true, message: "BooksList", data: checkBook });
  } catch (err) {
    return res.status(500).send({ status: false, err: err.message });
  }
};

// =================> Update Book Api <================
const updateBook = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    if (!isValidObjectId(bookId)) {
      return res.status(404).send({
        status: false,
        message: "Invalid BookId",
      });
    }
    let data = req.body;
   
    let { title, excerpt, releasedAt, ISBN } = data;
    if (!(title || excerpt||  releasedAt|| ISBN )) {
      return res
        .status(400)
        .send({ status: false, message: "Mandatory fields are requird !!! " });
    }

    
    let checkBook = await bookModel.findOne(
      { _id: bookId },
      { isDeleted: false }
    );
    if (!checkBook)
      return res.status(404).send({ status: false, message: "Book does not exist!!!!" });

    if(title){
      if (!isValidName(title)) {
        return res.status(400).send({
          status: false,
          message: "title should contain alphabets only",
        });
      }
      let checkTitle = await bookModel.findOne({ title: title });
      if (checkTitle) {
        return res.status(400).send({
          status: false,
          message: "title is already exists please provide unique title",
        });
      }
    }
    if(excerpt){
      if (!isValidExcerpt(excerpt)) {
        return res.status(400).send({
          status: false,
          message: "excerpt should be in alphabatical order",
        });
      }
    }
    if(releasedAt){
      if (!releasedAt) {
        return res
          .status(400)
          .send({ status: false, message: "please provide the date at releasedAt " });
      }
    }
    if(ISBN){
      if (!isValidISBN(ISBN)) {
        return res
          .status(400)
          .send({ status: false, message: "ISBN  follow 10 & 13 digit number" });
      }
      let checkISBN = await bookModel.findOne({ ISBN: ISBN });
      if (checkISBN) {
        return res.status(400).send({
          status: false,
          message: "ISBN already exists please provide unique ISBN",
        });
      }
    }
  

    let updatedBooks = await bookModel.findOneAndUpdate(
      { _id: bookId },
      { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN },
      { new: true }
    );
    res.status(200).send({
      status: true,
      message: "Successfully updated book Details",
      data: updatedBooks,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// =================> Delete Books by Id <================
const deleteBook = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    let obj = {};
    if (req.params.bookId) {
      if (!bookId)
        return res
          .status(404)
          .send({ status: false, msg: "Please provide valid bookId" });
      else obj.bookId = req.params.bookId;
    }
    const dataObj = { isDeleted: true };

    let checkBook = await bookModel.findOneAndUpdate(
      { _id: obj.bookId, isDeleted: false },
      { $set: dataObj },
      { new: true }
    );
    if (!checkBook)
      return res.status(404).send({ status: false, msg: "Book all ready deleted " });

    res.status(200).send({
      status: true,
      msg: "Books data has been deleted successfully",
      data: checkBook,
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.createBook = createBook;
module.exports.getBooks = getBooks;
module.exports.deleteBook = deleteBook;
module.exports.getBooksById = getBooksById;
module.exports.updateBook = updateBook;
