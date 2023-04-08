const mongoose = require('mongoose');

const queryContact = mongoose.Schema({

    fname  : String ,
    lname  : String ,
    email  : String,
    phone  : Number,
    query: String
});


module.exports = mongoose.model('queryContact', queryContact);