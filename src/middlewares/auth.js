const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel");
let decodedToken;
let { isValidObjectId } = require("../validator/validator");

// AUTHENTICATION
const authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"] || req.headers["X-Api-Key"];
    if (!token)
      return res
        .status(400)
        .send({ status: false, msg: "TOKEN MUST BE PRESENT" });

    decodedToken = jwt.verify(token, "group-39", function (err, token) {
      if (err) {
        return res
          .status(401)
          .send({ status: false, msg: "TOKEN  IS NOT VALID" });
      } else {
        return token;
      }
    });

    req.tokenId = decodedToken.userId;
    next();
  } catch (err) {
    res.status(500).send({ Status: "SERVER ERROR", Msg: err.message });
  }
};

//<-----------------This function is used Authorisation of a user------------->//

const authorise = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    const data = req.body;

    //<-------Passing LoggedIn UserId into Route Handler------>//
    let validUser = decodedToken.userId;
    req.userId = validUser;

    //<---------------------This is for Query Paramrter----------------->//
    if (Object.keys(req.query) != 0) {
      try {
        //<------Validating userrId from Query Parameter------>//

        // let validObjectId = ObjectId.isValid(req.query.userId);

        let userId = req.query.userId;
        //<------Fetching The Required Book Using Query Parameter------->//
        let finduserIdObj = { isDeleted: false };
        if (userId) {
          if (!isValidObjectId(userId)) {
            return res.status(404).send({
              status: false,
              message: "Invalid userId",
            });
          }
          if (req.query.userId == validUser)
            finduserIdObj.userId = req.query.userId;
          else if (!userId)
            return res
              .status(400)
              .send({ status: false, msg: "Invalid user ID !!! " });
          else
            return res
              .status(401)
              .send({ status: false, msg: "Unauthorised!!!" });
        }

        //<------Fetching The Filters from Query Parameter-------->//

        if (req.query.category) finduserIdObj.category = req.query.category;
        if (req.query.subcategory)
          finduserIdObj.subcategory = req.query.subcategory;
        let fetchuserId = await bookModel
          .findOne(finduserIdObj)
          .select({ userId: 1, _id: 0 });

        //<---------Checking Book Exist or not--------->//
        if (fetchuserId != null) {
          req.varifieduser = fetchuserId.userId;

          return next();
        }
        return res.status(404).send({ msg: "No Data Found !! " });
      } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
      }
    }

    // <---------------This is for Path Paramrter and Request Body----------------->//

    if (Object.keys(req.body) != 0 || Object.keys(req.params) != 0) {
      try {
        //<------This is for Request Body------>//
        if (req.body.userId) {
          let id = req.body.userId;
          if (!id)
            return res
              .status(400)
              .send({ status: false, msg: "Enter valid user Id." });
          if (decodedToken.userId == id) return next();
          else
            return res
              .status(401)
              .send({ status: false, msg: "Unauthorised!!!" });
        }

        //<------This is for Path Parameter------>//
        let validuserId = req.params.bookId;
        console.log("this is from path", validuserId);
        req.tokenId = decodedToken.userId;
        let validuser = decodedToken.userId;
        let idCheckObj = {};

        //<------Checking BookId is Valid or Not----->//
        if (validuserId) {
          if (!validuserId)
            return res
              .status(404)
              .send({ status: false, msg: "Invalid Book Id !!" });
          if (!isValidObjectId(bookId)) {
            return res.status(404).send({
              status: false,
              message: "Invalid BookId",
            });
          } else idCheckObj.bookId = req.params.bookId;
        }

        //<------Checking Book is Exist or Not------->//
        let userId = await bookModel
          .findById(idCheckObj.bookId)
          .select({ userId: 1, _id: 0 });
        console.log("login user", userId);
        if (!userId)
          return res
            .status(404)
            .send({ status: false, msg: "Please provide valid Id!!!" });
        userId = userId.userId.toString();
        if (validUser != userId)
          return res
            .status(403)
            .send({ status: false, msg: "User not Authorised !!!" });

        return next();
      } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
      }
    }

    return next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.authenticate = authenticate;
module.exports.authorise = authorise;
