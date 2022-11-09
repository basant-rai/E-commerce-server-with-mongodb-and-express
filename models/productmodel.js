const mongoose = require("mongoose")
const{ObjectId} = mongoose.Schema

const product_schema = new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
        trim:true,
    },
    product_price:{
        type: Number,
        required:true,
    },
    product_description:{
        type:String,
        required:true,
    },
    product_image:{
        type:String,
        required:true,
    },
    product_in_total:{
        type: Number,
        required:true
    },
    product_category:{
        type:ObjectId,
        ref:'Category_model',
        required:true
    },
    rating:{
        type:Number,
        default:1
    }
},{timestamps:true})
module.exports = mongoose.model("Product_model",product_schema)