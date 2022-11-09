const { check, validationResult } = require('express-validator')

exports.categoryCheck = [
    check('category_name', 'category name is required').notEmpty().isLength({ min: 3 }).withMessage("category must be of 3 characters")
]

exports.productCheck = [
    check('product_name', 'product name is required').notEmpty().isLength({ min: 3 }).withMessage("Character must be of 3 character"),
    check('product_price', "product price is required").notEmpty().isNumeric().withMessage("Price must be in number"),
    check("product_description", "Description is required").notEmpty().isLength({ min: 20 }).withMessage("Must be of 20 character"),
    check("product_in_total", "Total is requied").notEmpty().isNumeric().withMessage(" Must be in number"),
]

exports.userCheck = [
    check("user_name", "Username is required").notEmpty().isLength({ min: 3 }).withMessage("Must be of 3 character"),
    check("email", "Email is required").notEmpty().isEmail().withMessage("Email format incorrect"),
    check("password", "Password is required").notEmpty().isLength({ min: 3 }).withMessage("Must be  character").isLength({ max: 15 })
    .withMessage("maximum length is 15").matches(/^[A-Z]/).withMessage("password must contain uppercase at first")
    .matches(/[a-z]/).withMessage("password must contain lowercase")
    .matches(/[-_!@#$%^&*]/).withMessage("password must conatain atleast one character")
]
//category check ,validation
exports.validation = (req, res, next) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array()[0].msg })

        // return res.status(400).json({errors:errors.array().map(err=>{return err.msg})})
    }
    next()

}

