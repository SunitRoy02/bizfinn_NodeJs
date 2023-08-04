const mongoose = require('mongoose');

const lendersSchema = mongoose.Schema({

    name: String,
    contact_person_name: String,
    email: String,
    mobile: Number,
    password: String,
    lender_id: Number,
    commission: Number,
    case_logged : Number,
    case_approved : Number,
    case_pending: Number,
    createdAt : String,
    updatedAt : String,
    avatar:String,
    channel_partnership_agrement: Object
});

module.exports = mongoose.model('lenders', lendersSchema);