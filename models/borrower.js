const mongoose = require('mongoose');

const borrowerSchema = mongoose.Schema({

    companyName: String,
    mobile: Number,
    borrower_id: Number,
    channel_parther: Object,
    case_logged : Number,
    case_approved : Number,
    case_pending: Number,
    createdAt : String,
    updatedAt : String,
    avatar:String
});

module.exports = mongoose.model('borrowers', borrowerSchema);