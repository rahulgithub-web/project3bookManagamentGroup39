const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

// AUTHENTICATION
const authenticate = function (req, res, next) {
  try {
    let token = req.headers['x-api-key'];
    if (!token)
      return res.status(400).send({ status: false, msg: 'TOKEN MUST BE PRESENT' });
    let decodedToken = jwt.verify(token, 'group-39');
    if (!decodedToken)
      return res.status(401).send({ status: false, msg: 'TOKEN  IS NOT VALID' });
    next();
  } catch (err) {
    res.status(500).send({ Status: 'SERVER ERROR', Msg: err.message });
  }
};

// AUTHORATION
const authorise = async function (req, res, next) {
    try {
      token = req.headers['x-api-key'];
      let bookId = req.params.bookId;
      let decodedToken = jwt.verify(token, 'group-39');
      let loggedInUser = decodedToken.userId;
      let bookData = await bookModel.findById({ userId: loggedInUser, _id: bookId });
      if (!bookData)
        return res.status(403).send({status: false, msg: 'YOU ARE NOT AUTHORIZED',
        });
      next();
    } catch (err) {
      res.status(500).send({ Status: 'SERVER ERROR', Msg: err.message });
    }
  };
  

module.exports = { authenticate };
module.exports = { authorise };