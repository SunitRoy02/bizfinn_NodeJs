const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    lender_name: String,
    comment: String,
    createdAt : { type: Date, default: Date.now },
    updatedAt : Date,
    query_no: Number,
    case: String,
    status: { type: Number, default: 0 },
    
});

module.exports = mongoose.model('query', userSchema);