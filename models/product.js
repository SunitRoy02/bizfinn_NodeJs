const mongoose = require('mongoose');

const productSchema = mongoose.Schema({

    name : String ,
    sunCategoryId : String,
    image : {
        type: [String],
    },
    thumbnilImg: String,
    price : String ,
    discription : String ,
    discountAmount : String ,
    rating : String ,
    slug : String ,
    stock: Number,




});

module.exports = mongoose.model('products', productSchema);