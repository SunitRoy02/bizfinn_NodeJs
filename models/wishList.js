const mongoose = require('mongoose');

const widhListSchema = mongoose.Schema({

    userId : String,
    productId: String,
});


module.exports = mongoose.model('wishList', widhListSchema);