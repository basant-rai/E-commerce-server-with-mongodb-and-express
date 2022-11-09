const express = require('express');
const { viewProduct, productDetails, productByCategory, updateProduct, deleteProduct, addProduct, filteredProducts, relatedProducts } = require('../Controller/productController');
const { requireSignIn } = require('../Controller/userController');
const upload = require('../utils/fileUpload');
const { validation, productCheck } = require('../Validation');
const router = express.Router();

// router.post("/productadd",upload.single('product_image'),productCheck,validation,requireSignIn,addProduct);
router.post("/productadd",upload.single('product_image'),requireSignIn,productCheck,validation,addProduct);
router.get("/productview",viewProduct);
router.get("/productdetails/:id",productDetails);
router.get('/productCategory/:category_id',productByCategory);
router.put('updateproduct/:id',upload.single('product_image'),requireSignIn,productCheck,validation,updateProduct);
router.delete('/deleteproduct/:id', requireSignIn,deleteProduct);
router.post('/filteredproduct',filteredProducts);
router.get ('/relatedproducts/:id',relatedProducts);

module.exports = router;