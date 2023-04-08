const { check } = require('express-validator');


exports.loginValidation = [

    check("email").notEmpty().withMessage('Email is required'),
    check("email").isEmail().withMessage("Please enter valid email address"),
    check("password").notEmpty().withMessage('Password is required'),
    check("password").isLength({min:6}).withMessage('Password length must be 6 character long '),
]


exports.registerValidation = [

    check("name").notEmpty().withMessage('Name is required'),
    check("email").notEmpty().withMessage('Email is required'),
    check("email").isEmail().withMessage("Please enter valid email address"),
    check("password").notEmpty().withMessage('Password is required'),
    check("password").isLength({min:6}).withMessage('Password length must be 6 character long '),
]

exports.forgotPassValidation = [

    check("email").notEmpty().withMessage('Email is required'),
    check("email").isEmail().withMessage("Please enter valid email address"),

]


exports.getProfileValidation = [

    check("userId").notEmpty().withMessage('User Id is required'),
    check("userId").isString().withMessage("Please enter valid User Id"),

]


