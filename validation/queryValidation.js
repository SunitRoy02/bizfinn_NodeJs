const { check } = require('express-validator');


exports.queryValidation  = [
    check("fname").notEmpty().withMessage('First Name is required'),
    check("lname").notEmpty().withMessage('Last Name is required'),
    check("email").notEmpty().withMessage('Email is required'),
    check("email").isEmail().withMessage('Please enter valid email address'),
    check("query").notEmpty().withMessage('Short Discription is required'),
]