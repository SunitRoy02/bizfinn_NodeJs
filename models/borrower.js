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
    avatar:String,
    bussiness_details:Object,
    kyc_details:Object,
    financial_details:Object
});

module.exports = mongoose.model('borrowers', borrowerSchema);