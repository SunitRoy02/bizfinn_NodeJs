const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    content: String,
    contentType : String,
    senderId: String,
    receiverId : String,
    roomId : String,
    id: mongoose.Schema.Types.ObjectId, // Reference to the recipient user's ObjectId
    media: [String], // Array of media URLs or paths
    createdAt: { type: Date, default: Date.now },
    isSeen:{type:Boolean , default:false}
});

const chatConversationSchema = mongoose.Schema({
    roomId: String, // Reference to the recipient user's ObjectId
    users : [String],
    participants : [Object],
    messages : String, // Array of media URLs or paths
    createdAt: { type: Date, default: Date.now },
});




module.exports = {

    chatDetails : mongoose.model('chats', chatSchema) ,
    chatConversation : mongoose.model('chatConversation', chatConversationSchema) ,

}