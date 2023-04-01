const { check } = require('express-validator');


exports.addBannerValidation  = [
    check("imageUrl").notEmpty().withMessage('Image is required'),
]