const mongoose = require('mongoose');


const docSchema = mongoose.Schema({
    url : String,
    docId : mongoose.Types.ObjectId,
    createdAt : { type: Date, default: Date.now },
})

const commentOnCase = mongoose.Schema({
    commenterId: String,
    type: String,
    remark: { type: String, default: ""},
    createdAt : { type: Date, default: Date.now },
});

const querySchema = mongoose.Schema({

    lender_name: String,
    lenderId: String,
    comment: String,
    createdAt : { type: Date, default: Date.now },
    updatedAt : Date,
    query_no: Number,
    case_no: Number,
    case: String,
    borrower: String,
    borrowerName: String,
    borrowerTurnOver: String,
    business_structure: String,
    loan_ask: String,
    comments:[commentOnCase],
    status: { type: Number, default: 0 },
    extraDocs : { type: [docSchema], unique: true },
    
});

module.exports = mongoose.model('query', querySchema);