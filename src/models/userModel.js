const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    name : {
        type: String,
        required: true,
        trim: true,
    },
    phone : {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password : {
        type: String,
        trim: true,
        required: true,
        min: 8,
        max: 15
    },
    address : {
        street : {
            type: String,
            trim: true,
        },
        city : {
            type: String,
            trim: true, 
        },
        pincode : {
            type: String,
            trim: true,
        }
    }
}, {timestamps: true});

module.exports = mongoose.model("User", userModel);
