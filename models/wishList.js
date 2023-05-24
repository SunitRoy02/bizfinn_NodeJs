const mongoose = require('mongoose');

const widhListSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }]
});


module.exports = mongoose.model('wishList', widhListSchema);