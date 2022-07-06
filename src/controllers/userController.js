const userModel = require("../models/userModel");

const createUser = async function (req, res) {
    try {
        let data = req.body;
        // let {title, name, phone, email, password, address} = data;

        let savedUser = await userModel.create(data);
        return res.status(201).send({ status: true, message: "Users Data has been created successfully", data: savedUser });
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { createUser };