const mongoose = require('mongoose');

const categoriesSchema = mongoose.Schema({

    name : String ,
    image : String ,
    slug : String ,
    createdAt: String
});

module.exports = mongoose.model('categories', categoriesSchema);
