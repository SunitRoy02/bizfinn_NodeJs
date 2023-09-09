const mongoose = require('mongoose');


const lendersSchema = mongoose.Schema({
    lenderId: String,
    approved: { type: Number, default: 0 },
    lander_approved: { type: Number, default: 0 },
    landerName: String,
    createdAt : { type: Date, default: Date.now },
    updatedAt : Date,
    lender_remark: { type: String, default: ""},    
});


const commentOnCase = mongoose.Schema({
    commenterId: String,
    type: String,
    remark: { type: String, default: ""},
    createdAt : { type: Date, default: Date.now },
});


const casesSchema = mongoose.Schema({

    requirement: Number,
    type_of_loan: String,
    nature_of_collateral: String,
    createdAt : { type: Date, default: Date.now },
    updatedAt : Date,
    status: { type: Number, default: 0 },
    lender_remark: String,
    case_no: Number,
    borrower: String,
    borrowerName: String,
    borrowerTurnOver: String,
    business_structure: String,
    doc_passwords: String,
    lenders:[lendersSchema],
    comments:[commentOnCase]
    
});

module.exports = mongoose.model('cases', casesSchema);