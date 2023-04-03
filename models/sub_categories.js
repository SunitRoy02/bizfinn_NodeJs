const mongoose = require('mongoose');

const subCategoriesSchema = mongoose.Schema({

    name : String ,
    image : String ,
    categoryId : String,
    categoryData : Object,
    createdAt: String
});


module.exports = mongoose.model('subCategories', subCategoriesSchema);