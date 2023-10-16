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
const commentOnCase = mongoose.Schema({
    commenterId: String,
    type: String,
    remark: { type: String, default: ""},
    createdAt : { type: Date, default: Date.now },
});

const lendersSchema = mongoose.Schema({
    lenderId: { type: String, default: ""},
    approved: { type: Number, default: 0 },
    lander_approved: { type: Number, default: 0 },
    approved_amount: { type: Number, default: 0 },
    landerName: { type: String, default: ""},
    createdAt : { type: Date, default: Date.now },
    updatedAt : Date,
    lender_remark: { type: String, default: ""},  
});
const shortedSchema = mongoose.Schema({
    lenderId: String,
    landerName: String,
});

const casesSchema = mongoose.Schema({
    requirement: Number,
    type_of_loan: String,
    nature_of_collateral: String,
    createdAt : { type: Date, default: Date.now },
    updatedAt : Date,
    status: { type: Number, default: 0 },
    approved_amount: { type: Number, default: 0 },
    lender_remark: { type: String, default: "" },
    case_no: Number,
    borrower: String,
    borrowerName: String,
    borrowerTurnOver: String,
    business_structure: String,
    doc_passwords: String,
    lenders:{ type: [lendersSchema], unique: true },
    shortedLenders:{ type: [shortedSchema], unique: true },
    comments:[commentOnCase],
    kyc_details: kycSchema,
    financial_details: financialSchema,  
});
module.exports = mongoose.model('cases', casesSchema);
