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

module.exports.createUser = createUser