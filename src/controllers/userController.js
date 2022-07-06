const usermodel = require("../models/userModel")

const jwt = require('jsonwebtoken');
const userModel = require("../models/userModel");


const userModel = require('../models/userModel')


const createUser = async function (req, res) {

    try{
    let userDetails = req.body 
      //<------Checking Whether Request Body is empty or not----------->//
    if(!userDetails ){
        return res.status(400).send({status : false, msg : "All fields are mandatory."})
    }
    //<-------Creation Creation----------->//
    
   let userCreated = await userModel.create(userDetails)
   res.status(201).send({ status : true , data: userCreated })
  
   } catch (err) {
       return res.status(500).send({ msg: err.message })
   }
}





//////////////////////login api ////////////////////////

const userLogin = async function (req, res) {

    try {
        const data = req.body;
      const { email, password, userId } = data;
      let user = await userModel.findOne({ email, password})
      let token = jwt.sign(
        { 
            userId: user._id.toString(), iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30 * 60)

        },
      "group-39",
);

      res.header("x-api-key", token);
    res.status(200).send({ status: true, token: token, userId: userId });
    }

    catch(err) {
        res.status(500).send({ status: false, message: err.message })

    }
}



module.exports.createUser = createUser
module.exports.userLogin = userLogin

