const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const orderitem_schema = new mongoose.Schema({
    product:{
        type: ObjectId,
        ref: 'Product_model',
        requird:true
    },
    quantity:{
        type: Number,
        required:true
    },
    // total:{
    //     type:Number,
    //     required:true
    // }
},{timeStamps:true})

module.exports = mongoose.model("OrderItem_model",orderitem_schema)
