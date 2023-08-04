const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({

    title: String,
    subtitle: String,
    userId: String,
    createdAt : String,
});

module.exports = mongoose.model('notifications', notificationSchema);