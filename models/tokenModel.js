const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const token_schema = new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    user:{
        type:ObjectId,
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now(),
        expires: 86400
    }
})

module.exports = mongoose.model("Token_model",token_schema)