const { find } = require("../models/bookModel");
const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const validation = require("../validator/validator");

let {isEmpty,
    isValidObjectId,
    isValidISBN,
    isValidExcerpt,
  } = validation;

const createBook = async function (req, res) {

    try {
        const data = req.body;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({status: false, msg: "All fields are mandatory!"})
        }

        let { title, excerpt, userId, ISBN, category, subcategory } = data;
        if(!isEmpty(title)) {
            return res.status(400).send({status:false, message: "title should be present" });
        }
        if(!isEmpty(excerpt)) {
            return res.status(400).send({status:false, message: "excerpt should be present"});
        }
        if(!isEmpty(category)) {
            return res.status(400).send({status:false, message: "category should be present"});
        }
        if(!isEmpty(subcategory)) {
            return res.status(400).send({status:false, message: "subcategory should be present"});
        }
        if(!isEmpty(ISBN)) {
            return res.status(400).send({status:false, message: "ISBN should be present"});
        }
        if(!isValidISBN(ISBN)) {
            return res.status(400).send({status:false, message: "ISBN should follow 13 digit number"});
        }
        if(!isValidExcerpt(excerpt)) {
            return res.status(400).send({status:false, message: "excerpt should be in alphabatical order"});
        }
        let checkTitle = await bookModel.findOne({ title: title}); 
        if(checkTitle) {
            return res.status(400).send({status:false, message: "Title already exist"})
        }
        let checkingId = await userModel.findOne({userId: userId, isDelete: false})

        if(!isValidObjectId(checkingId)) {
            return res.status(400).send({status:false, message: "User with this userId is invalid"})
        }
        let checkISBN = await bookModel.findOne({ISBN: ISBN});
        if(checkISBN) {
            return res.status(400).send({status:false, message: "ISBN already exist"});
        }
        let savedData = await bookModel.create(data);

        return res.status(201).send({ status: true, msg : savedData})
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message})
    }
}


// get api
// const updateBook= async function(req , res){
//     try{
//         let id = req.params.bookId;
//         let data = req.body;
//         let book = await bookModel.findOne({ _id: id, isDeleted: false });

//         if (Object.keys(blog).length == 0) {
//             return res.status(404).send('No such Book found');
//           }
   
//         let update = await bookModel.findOneAndUpdate({$set: title, excerpt,releaseddate,ISBN})
//         return res.status(400).send('')
//     }
//     catch{
//       return req.status(500).send({status:false, msg:err.message})

//     }
    
// }
module.exports.createBook = createBook

// module.exports.updateBook = updateBook