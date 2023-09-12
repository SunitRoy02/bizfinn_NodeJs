const mongoose = require('mongoose');


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
    lender_remark: String,
    case_no: Number,
    borrower: String,
    borrowerName: String,
    borrowerTurnOver: String,
    business_structure: String,
    doc_passwords: String,
    lenders:{ type: [lendersSchema], unique: true },
    shortedLenders:{ type: [shortedSchema], unique: true },
    comments:[commentOnCase]
    
});

module.exports = mongoose.model('cases', casesSchema);
