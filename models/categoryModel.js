// const { default: mongoose } = require('mongoose')
const mongoose =require('mongoose')


const categorySchema = new mongoose.Schema({
    category_name:{
        type: String,
        required:true,
        trim:true
    }
},{timestamps: true})

module.exports = mongoose.model('Category_model',categorySchema)