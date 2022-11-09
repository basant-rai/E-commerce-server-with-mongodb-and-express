const Category_model = require("../models/categoryModel")

exports.addCategory = async (req, res) => {
    let category = await Category_model.findOne({ category_name: req.body.category_name })

    if (!category) {
        let category = new Category_model({
            category_name: req.body.category_name
        })
        category = await category.save()
        if (!category) {
            return res.status(400).json({ error: 'something went wrong' })
        }
        res.send(category)
    }
    else {
        return res.status(400).json({ error: 'Category already exists' })
    }

}

exports.viewCategories = async (req, res) => {
    let category = await Category_model.find()
    if (!category) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    res.send(category)
}

exports.updateCategory = async (req, res) => {
    let category = await Category_model.findByIdAndUpdate(req.params.id, {
        category_name: req.body.category_name
    }, { new: true })
    if (!category) {
        return res.status(400).json({ error: 'something went wrong' })
    }

    res.send(category)
}

exports.deleteCategory = async (req, res) => {
    //  Category_model.findByIdAndRemove(req.params.id)
    //  .then((category)=>{
    //     if(category==null){
    //         return res.status(400).json({error: "Category does not exist."})
    //     }
    //     return res.status(200).json({message: "Category deleted successfully."})
    // })
    // .catch(()=>{
    //     return res.status(400).json({error: "something went wrong"})
    // })(
    let category = await Category_model.findByIdAndDelete(req.params.id)
    if(!category){
        return res.status(400).json({error:"Error"})
    }else{
        if(category==null){
            return res.status(400).json({error:"Category not found"})
        }else{
            return res.status(200).json({message:'deleted succesfully'})
        }
    }


}
exports.findCategory = (req, res) => {
    Category_model.findById(req.params.id)
        .then((category) => {
            return res.send(category)
        })
        .catch(() => {
            return res.status(400).json({ error: "something went wrong" })
        })
}