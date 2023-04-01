const { check } = require('express-validator');


exports.categoriesValidation  = [
    check("name").notEmpty().withMessage('Category name is required'),
    check("image").notEmpty().withMessage('Category image is required'),
]