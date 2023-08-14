const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    name: String,
    email: String,
    mobile: Number,
    password: String,
    fcmToken: String,
    createdAt : { type: Date, default: Date.now },
    updatedAt : String,
    avatar:String,
    postCode: Number,
    active: { type: Number, default: 0 },
    userType: Number,

    //Lender-Borrower----------
    contact_person_name: String,
    lender_id: Number,
    commission: Number,
    case_logged : Number,
    case_approved : Number,
    case_pending: Number,
    channel_partnership_agrement: Object,
    //--

    borrower_id: Number,
    channel_partner: String,
    annual_turn_over: String,
    case_logged : Number,
    case_approved : Number,
    case_pending: Number,
    bussiness_details:Object,
    kyc_details: Object,
    financial_details:Object

});

module.exports = mongoose.model('users', userSchema);