const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const order_schema = mongoose.Schema({
    orderItems:[{
        type: ObjectId,
        ref:'OrderItem_model',
        required:true
    }],
    user:{
        type:ObjectId,
        ref:'User_model',
        required:true
    },
    total_price:{
        type:Number,
        required:true
    },
    shipping_address:{
        type:String,
        required:true
    },
    alternate_shipping_adddress:{
        type:String
    },
    city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    zip:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:"Pending"
    },
    contact:{
        type:Number,
        required:true
    }

},{timeStamps:true})

module.exports = mongoose.model("Order_model",order_schema)