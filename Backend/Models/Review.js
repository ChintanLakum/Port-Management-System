const mongoose = require("mongoose");
const crypto = require("crypto");
const { type } = require("os");
const review = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        require:true,
        unique: true,
    },
    message: {
        type: String,
        require: true,
    },
    email:{
        type:String,
        require:true,
        unique:true
    }
}, { timestamps: true });