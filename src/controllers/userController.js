const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const validation = require("../validator/validator");

let {
  isEmpty,
  isValidName,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidPinCode,
  isValidTitle,
} = validation;


// ==================> Create User Api <============= 
const createUser = async function (req, res) {
  try {
    let userDetails = req.body;
    let { title, name, phone, email, password } = userDetails;

    if (Object.keys(userDetails).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "All fields are mandatory." });
    }
    let { street, city, pincode } = userDetails.address;
    if(!isEmpty(title)) {
        return res.status(400).send({ status: false, msg: "Title must be present"});
    }
    if(!isEmpty(name)) {
        return res.status(400).send({ status: false, msg: "Name must be present"});
    }
    if(!isEmpty(phone)) {
        return res.status(400).send({ status: false, msg: "Phone no. must be present"});
    }
    if(!isEmpty(email)) {
        return res.status(400).send({ status: false, msg: "Email must be present"});
    }
    if(!isEmpty(password)) {
        return res.status(400).send({ status: false, msg: "Password must be present"});
    }
    if(!userDetails.address) {
        return res.status(400).send({ status: false, msg: "Address must contain street, city and pincode"});
    }
    if(!isEmpty(street)) {
        return res.status(400).send({ status: false, msg: "street must be present"});
    }
    if(!isEmpty(city)) {
        return res.status(400).send({ status: false, msg: "city must be present"});
    }
    if(!isEmpty(pincode)) {
        return res.status(400).send({ status: false, msg: "pincode must pe present"});
    }
    if(!isValidTitle(title)) {
        return res.status(400).send({ status: false, msg: "title must contain Mr, Mrs or Miss"});
    }
    if(!isValidName(name)) {
        return res.status(400).send({ status: false, msg: "Name should contain alphabet only"});
    }
    name = name.toLowerCase();
    if(!isValidPhone(phone)) {
        return res.status(400).send({ status: false, msg: "Phone no. must contains 10 digits only"});
    }
    if(!isValidPassword(password)) {
        return res.status(400).send({ status: false, msg: "Password must contain atleast 8 characters including one upperCase, lowerCase, special characters and Numbers"});
    }
    if(!isValidPinCode(pincode)) {
        return res.status(400).send({ status: false, msg: "Pincode must contain 6 digits only"});
    }
    let emailCheck = await userModel.findOne({ email: email}); 
    if(emailCheck) {
        return res.status(400).send({ status:false, msg: "Email id is already exist"});
    }   
    if(!isValidEmail(email)) {
        return res.status(400).send({ status: false, msg: "Email must be in correct format"});
    }
    email = email.toLowerCase();
    let phoneCheck = await userModel.findOne({ phone: phone}); 
    if(phoneCheck) {
        return res.status(400).send({ status: false, msg: "Phone no. is already exist"});

    }
    
    //<-------User Creation----------->//

    let userCreated = await userModel.create(userDetails);
    res.status(201).send({ status: true,msg: "User Model has been successfully created" ,data: userCreated });
  } catch (err) {
    return res.status(500).send({status: false, msg: err.message });
  }
};

// ==========> login api <=============

const userLogin = async function (req, res) {
  try {
    const data = req.body;
    const { email, password } = data;
    if (Object.keys(data).length == 0) {
        return res
          .status(400)
          .send({ status: false, msg: "All fields are mandatory." });
      }
    if(!isEmpty(email)) {
        return res.status(400).send({status: false, msg: "Email must be present"});
    } 
    if(!isEmpty(password)) {
        return res.status(400).send({ status: false, msg: "Password must be present"});
    } 
    if(!isValidEmail(email)) {
        return res.status(400).send({ status: false, msg: "Email should be in correct format"});
    }
    if(!isValidPassword(password)) {
        return res.status(400).send({ status: false, msg: "Password must contain one upperCase, lowerCase, special characters and Numbers"});
    }
    let getUsersData = await userModel.findOne({ email:email, password:password });
    if(!getUsersData) {
        return res.status(401).send({ status: false, msg: "Enter a valid Email or Password"});
    }
    let token = jwt.sign(
      {
        userId: getUsersData._id.toString(),
        iat: Math.floor(Date.now() / 1000), //issue date
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, //expires in 24 hr
      },
      "group-39"
    );
    console.log(token);
    res.setHeader("x-api-key", token);
    res
      .status(200)
      .send({
        status: true,
        message: "User Login Succesful",
        data: { userId: getUsersData._id, token: token },
      });
    console.log(token);
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.createUser = createUser;
module.exports.userLogin = userLogin;
