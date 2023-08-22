const mongoose = require('mongoose');


const lenderRemark = mongoose.Schema({
    lenderId: String,
    approved: { type: Number, default: 0 },
    landerName: String,
    createdAt : { type: Date, default: Date.now },
    updatedAt : Date,
    lender_remark: String,    
});



const userSchema = mongoose.Schema({

    requirement: Number,
    type_of_loan: String,
    nature_of_collateral: String,
    createdAt : { type: Date, default: Date.now },
    updatedAt : Date,
    status: { type: Number, default: 0 },
    lender_remark: String,
    case_no: Number,
    borrower: Object,
    lenders:[lenderRemark]
    
});

module.exports = mongoose.model('cases', userSchema);