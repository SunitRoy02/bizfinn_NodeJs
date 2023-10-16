const mongoose = require('mongoose');

const docSchema = mongoose.Schema({
    url : String,
    docId : mongoose.Types.ObjectId,
    status : { type: Number, default: 3 },
    createdAt : { type: Date, default: Date.now },
    updatedAt : { type: Date,},
})
const kycSchema = mongoose.Schema({
    createdAt : { type: Date, default: Date.now },
    updatedAt : String,
    aoa: docSchema,
    moa: docSchema,
    incorporation_certificate: docSchema,
    gst_certificate: docSchema,
    list_of_directors: docSchema,
    pan_certificate: docSchema,
    kyc_pan_aadhar_all: docSchema,
})

const financialSchema = mongoose.Schema({
    createdAt : { type: Date, default: Date.now },
    updatedAt : String,
    financial_stat: docSchema,
    gst_filling: docSchema,
    bank_statment_24: docSchema,
    provisional_sheet: docSchema,
    itr_acknowledgement: docSchema,
    debt_service: docSchema,
    mis_additional: docSchema,
})

const bussinessSchema = mongoose.Schema({
    createdAt : { type: Date, default: Date.now },
    updatedAt : String,
    borrowerId: String,
    register_company_name: String,
    bussiness_structure: String,
    age_of_business: String,
    type_of_business: String,
    annual_turn_over: String,
    type_of_loan: String,
    gst_number: String,
})
const userSchema = mongoose.Schema({
    id : mongoose.Types.ObjectId, 
    name: String,
    admin: String,
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
    bussiness_details: bussinessSchema,
    kyc_details: kycSchema,
    financial_details: financialSchema,

});

module.exports = mongoose.model('users', userSchema);