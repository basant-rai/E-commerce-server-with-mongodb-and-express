const express = require('express')
const { addCategory, viewCategories, updateCategory, deleteCategory, findCategory } = require('../Controller/categoryController')
const { requireSignIn } = require('../Controller/userController')
const { categoryCheck, validation } = require('../Validation')
const router = express.Router()

router.post('/addcategory',categoryCheck,validation,requireSignIn,addCategory)
router.get('/viewcategory',viewCategories)
router.put('/update/:id',requireSignIn,updateCategory)
router.delete('/deletecategory/:id',requireSignIn,deleteCategory)
router.get("/findcategory/:id",findCategory)

module.exports = router


