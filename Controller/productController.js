const Product_model = require('../models/productmodel')

exports.addProduct = async (req, res) => {
    let product_add = new Product_model({
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_description: req.body.product_description,
        product_image: req.file.path,
        product_in_total: req.body.product_in_total,
        product_category: req.body.product_category,
    })
    product_add = await product_add.save()
    if (!product_add) {
        return res.status(400).json({ error: "Error 400" })
    } res.send(product_add)
}

exports.viewProduct = async (req, res) => {
    let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt"
    let order = req.query.order ? req.query.order : 1
    let limit = req.query.limit ? Number(req.query.limit) : 2000000
    // ascending:1,ASC
    // descending:0,DESC
    let product_view = await Product_model.find().populate('product_category', 'category_name')
        .sort([[sortBy, order]])
        .limit(limit)
    if (!product_view) {
        return res.status(400).json({ error: "Error 400" })
    } res.send(product_view)

    // .then((product_view)=>{
    //     return res.send(product_view)
    // })
    // .catch(()=>{
    //    return res.status(400).json({error:"something is wrong"}) 
    // })
}

exports.productDetails = (req, res) => {
    Product_model.findById(req.params.id).populate('product_category', 'category_name')
        .then((product_details) => {
            return res.send(product_details)
        })
        .catch(() => {
            return res.status(400).json({ error: "something is wrong" })
        })
}

exports.productByCategory = async (req, res) => {
    let product_category = await Product_model.find({ category: req.params.category_id })
    if (!product_category) {
        return res.status(400).json({ error: "Error 400" })
    } res.send(product_category)
}
exports.updateProduct = async (req, res) => {
    let product_update = await Product_model.findByIdAndUpdate(req.params.id, {
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_description: req.body.product_description,
        product_image: req.file.path,
        product_in_total: req.body.product_in_total,
        product_category: req.body.product_category,
    },
        { new: true }
    )
    if (!product_update) {
        return res.status(400).json({ error: "Error 400" })
    } res.send(product_update)
}

exports.deleteProduct = async (req, res) => {
    let product_delete = await Product_model.findByIdAndRemove(req.params.id)
    if (!product_delete) {
        return res.status(400).json({ error: "Error" })
    } else {
        if (product_delete == null) {
            return res.status(400).json({ error: "product not found" })
        } else {
            return res.status(200).json({ message: 'deleted succesfully' })
        }
    }
}

// to get filter products

exports.filteredProducts = async(req,res)=>{
    let sortBy = req.query.order ? req.query.sortBy : "createdAt"
    let order = req.query.order ? req.query.order : "ASC"
    let limit = req.query.order ? Number(req.query.limit) : 2000000

// to get filter
    let Args = {}
    for(let key in req.body.filters){
        if(req.body.filters[key].length>0){
            if(key == "product_price"){
                Args [key]= {
                    $gte:req.body.filters[key][0],
                    $lte:req.body.filters[key][1]
                }
            }else{
                Args[key] = req.body.filters[key]
            }
        }
    }
    let filteredProducts = await Product_model.find(Args).populate("product_category")
    .sort([[sortBy,order]])
    .limit(limit)

    if(!filteredProducts){
        return res.status(400).json({error:"Something went wrong"})
    }else{
        res.json({
            filteredProducts,
            size: filteredProducts.length
        })
    }
}

// to get related products

exports.relatedProducts = async(req,res)=>{
    let product = await Product_model.findById(req.params.id);
    if(!product){
        return res.status(400).json({error:"Something went wrong"})
    }else{
        let relatedProducts = await Product_model.find({
            product_category:product.product_category,
            _id:{$ne:product._id}
        })
        .sort([['createAt','DESC']])
        .limit(4)
        if(!relatedProducts){
            return res.status(400).json({error:"Something went wrong"})
        }else{
            res.send(relatedProducts)
        }
    }
}