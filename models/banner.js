const mongoose = require('mongoose');

const bannersSchema = mongoose.Schema({

    imageUrl: {
        type: String,
        trim: true,
    },
    name:String,
    shortDis: String,
    discription:String,
    slug:String,


});


module.exports = mongoose.model('banners', bannersSchema);