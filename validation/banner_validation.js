const { check } = require('express-validator');


exports.addBannerValidation  = [
    check("imageUrl").notEmpty().withMessage('Image is required'),
    check("name").notEmpty().withMessage('Name is required'),
    check("shortDis").notEmpty().withMessage('Short Discription is required'),
    check("slug").notEmpty().withMessage('Slug is required'),
]