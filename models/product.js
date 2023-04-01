const mongoose = require('mongoose');

const productSchema = mongoose.Schema({

    name : String ,
    categoryId : String,
    image : String ,
    price : String ,
    discription : String ,
    discountPrice : String ,
    rating : String ,
    slug : String ,


});

module.exports = mongoose.model('products', productSchema);