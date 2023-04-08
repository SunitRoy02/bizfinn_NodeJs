const mongoose = require('mongoose');

const productSchema = mongoose.Schema({

    name : String ,
    // subCategoryId : String,
    subCategory : Object,
    image : {
        type: [String],
    },
    thumbnilImg: String,
    price : Number,
    discription : String ,
    discountAmount : Number ,
    rating : String ,
    slug : String ,
    stock: Number,
    createdAt: String,
    updatedAt : String,
    id : mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('products', productSchema);