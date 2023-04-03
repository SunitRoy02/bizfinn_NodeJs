const { check } = require('express-validator');


exports.productValidation = [

    check("name").notEmpty().withMessage('Name is required'),
    check("sunCategoryId").notEmpty().withMessage('SubCategory is required'),
    check("price").notEmpty().withMessage('Price is required'),
    check("discountAmount").notEmpty().withMessage('Discount Price is required'),
    check("discription").notEmpty().withMessage('Discription is required'),
    // check("rating").notEmpty().withMessage('Rating is required'),
    check("thumbnilImg").notEmpty().withMessage('Thumbnil image is required'),
    check("stock").notEmpty().withMessage('Stock quantity is required'),
]


// exports.registerValidation = [

//     check("name").notEmpty().withMessage('Name is required'),
//     check("email").notEmpty().withMessage('Email is required'),
//     check("email").isEmail().withMessage("Please enter valid email address"),
//     check("password").notEmpty().withMessage('Password is required'),
//     check("password").isLength({min:6}).withMessage('Password length must be 6 character long '),
// ]

// exports.forgotPassValidation = [

//     check("email").notEmpty().withMessage('Email is required'),
//     check("email").isEmail().withMessage("Please enter valid email address"),

// ]


