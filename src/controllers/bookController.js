const bookModel = require("../models/bookModel")

const userModel = require("../models/userModel")

const validation = require("../validator/validator")

let {isValidObjectId} = validation

const createBook = async function (req, res) {

    try {
        const data = req.body;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({status: false, msg: "All fields are mandatory!"})
        }

        let { title, excerpt, userId, ISBN, category, subcategory } = data

        let checkingId = await userModel.findOne({userId: userId})

        if (!checkingId) 
        return res.status(400).send({status: false, msg: "This userId does not exist"})

        let saveddata = await bookModel.create(data)

        return res.status(201).send({ status: true, msg : saveddata})
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message})
    }
}


module.exports.createBook = createBook