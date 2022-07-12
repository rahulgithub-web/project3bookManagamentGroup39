const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const validation = require("../validator/validator");
const reviewModel = require("../models/reviewModel");
const mongoose = require("mongoose");

let { isEmpty, isValidObjectId, isValidISBN, isValidExcerpt, isValidName, isValidDate } =
  validation;

// ============> Create Book Api <==============
const createBook = async function (req, res) {
  try {
    const data = req.body;

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "All fields are mandatory!" });
    }

    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;
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
    if(!isEmpty(userId)) {
      return res.status(400).send({ status: false, msg: "userId must be present"})
    }
    if(!isEmpty(releasedAt)) {
      return res.status(400).send({ status: false, msg: "releasedAt should be present"});
    }
    if (!isValidISBN(ISBN)) {
      return res
        .status(400)
        .send({ status: false, message: "ISBN should follow 13 digit number" });
    }
    if (!isValidExcerpt(excerpt)) {
      return res.status(400).send({
        status: false,
        message: "excerpt should contain alphabates only",
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
        .send({ status: false, message: "Invalid userId" });
    }
    let checkISBN = await bookModel.findOne({ ISBN: ISBN });
    if (checkISBN) {
      return res
        .status(400)
        .send({ status: false, message: "ISBN already exist" });
    }
    if(!isValidDate(releasedAt)) {
      return res.status(400).send({ status: false, msg: "Please provide a valid date in 'YYYY-MM-DD' format" });
    }
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
const getBooks = async function (req, res) {
  try {
    let queryData = req.query;

    let validUserId = req.tokenId;

    if (Object.keys(queryData) == 0) {
      let blog = await bookModel.find({
        userId: validUserId,
        isDeleted: false,
      });

      if (blog.length == 0) {
        return res.status(404).send({ status: false, msg: "No Blog Found" });
      }
      return res.status(200).send({ status: true, msg: blog });
    }

    let { userId, category, subcategory } = queryData;
    let ObjectId = mongoose.Types.ObjectId(userId);
    if (!ObjectId) {
      return res
        .status(400)
        .send({ status: false, message: "user is not Valid" });
    }

    let addObj = { isDeleted: false };

    addObj.userId = validUserId;

    if (category) {
      addObj.category = category;
    }

    if (subcategory) {
      addObj.subcategory = subcategory;
    }
    console.log(addObj);
    let showData = {
      _id: 1,
      title: 1,
      excerpt: 1,
      userId: 1,
      category: 1,
      reviews: 1,
      releasedAt: 1,
    };

    const bookData = await bookModel
      .find( addObj )
      .select(showData)
      .sort({ title: 1 });
console.log(bookData)
    if (bookData.length == 0) {
      return res.status(404).send({ status: false, message: "No Books found with the given query" });
    }

    return res.status(200).send({
      status: true,
      message: "Books List",
      data: bookData,
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

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
    }).select({__v:0, createdAt: 0, updatedAt: 0, isDeleted: 0});

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
    let data = req.body;

    let { title, excerpt, releasedAt, ISBN } = data;
    let bookId = req.params.bookId;
    if (!isValidObjectId(bookId)) {
      return res.status(404).send({
        status: false,
        message: "Invalid BookId",
      });
    }
    let checkBook = await bookModel.findById(
      { _id: bookId },
      { isDeleted: false }
    );
    if (!checkBook)
      return res.status(404).send({ status: false, message: "No Book Found" });
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "All fields are mandatory!" });
    }
    let checkTitle = await bookModel.findOne({ title: title });
    if (checkTitle) {
      return res.status(400).send({
        status: false,
        message: "title is already exists please provide unique title",
      });
    }
    if (title) {
      if (!isValidName(title)) {
        return res.status(400).send({
          status: false,
          message: "title should contain alphabets only",
        });
      }
    }
    if (excerpt) {
      if (!isValidExcerpt(excerpt)) {
        return res.status(400).send({
          status: false,
          message: "excerpt should be in alphabatical order",
        });
      }
    }
    let checkISBN = await bookModel.findOne({ ISBN: ISBN });
    if (checkISBN) {
      return res.status(400).send({
        status: false,
        message: "ISBN already exists please provide unique ISBN",
      });
    }
    if (ISBN) {
      if (!isValidISBN(ISBN)) {
        return res.status(400).send({
          status: false,
          message: "ISBN should follow 10 to 13 digit numbers only",
        });
      }
    }

    if (releasedAt) {
      if (!isValidDate(releasedAt)) {
        return res.status(400).send({
          status: false,
          message: "Please provide the release date in the format of 'YYYY-MM-DD'"
        });
      }
    }
    releasedAt = Date.now();
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
      if (!isValidObjectId(bookId))
        return res
          .status(404)
          .send({ status: false, msg: "Please provide valid bookId" });
      else obj.bookId = req.params.bookId;
    }
    const dataObj = { isDeleted: true };

    let checkBook = await bookModel.findOneAndUpdate(
      { _id: obj.bookId, isDeleted: false },
      { $set: dataObj, deletedAt: Date.now() },
      { new: true }
    );
    if (!isValidObjectId(checkBook))
      return res.status(404).send({ status: false, msg: "No Books Found" });

    res.status(200).send({
      status: true,
      msg: "Books data has been deleted successfully",
      data: checkBook,
    });
  } 
  catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.createBook = createBook;
module.exports.getBooks = getBooks;
module.exports.getBooksById = getBooksById;
module.exports.updateBook = updateBook;
module.exports.deleteBook = deleteBook;