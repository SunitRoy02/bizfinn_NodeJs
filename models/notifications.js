const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({

    title: String,
    subtitle: String,
    userId: String,
    read: Boolean,
    createdAt : { type: Date, default: Date.now },
});

module.exports = mongoose.model('notifications', notificationSchema);