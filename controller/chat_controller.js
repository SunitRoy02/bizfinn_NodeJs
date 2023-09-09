const { chatDetails, chatConversation } = require('../models/chat');
const users = require('../models/users')
const { ObjectId } = require('mongoose').Types;


async function createOrGetConversationRoom(senderId, receiverId,data) {
    // Sort the user IDs to ensure consistency in room detection
    const sortedUserIds = [senderId, receiverId].sort();
  
    // Check if a conversation room already exists between the users
    const existingConversation = await chatConversation.findOne({
      users: sortedUserIds,
    });
  
    if (existingConversation) {

        //update msg here ---

      return existingConversation;
    }
  
    // If no conversation room exists, create a new one
    const uniqueId = uid();
    const userData1 = await users.findOne({ _id: senderId });
    const userData2 = await users.findOne({ _id: receiverId });
    const userParticipants = [userData1, userData2];
  
    const convoData = {
      users: sortedUserIds,
      participants: userParticipants,
      messages:  data.contentType == 2 ? "Image" : data.content,
      roomId: uniqueId,
    };
  
    const convoObj = new chatConversation(convoData);
    await convoObj.save();
  
    return convoObj;
  }

const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}


module.exports = {
    sendMessage: async (data) => {

        console.log(data);

        try {
          const { senderId, receiverId, roomId } = data;
      
          if (!roomId) {
            // Create or get the conversation room
            const conversationRoom = await createOrGetConversationRoom(senderId, receiverId,data);
            data.roomId = conversationRoom.roomId;
          }
      
          const dataObj = new chatDetails(data);
          await dataObj.save();
      
          const message = "Message Sent Successfully";
          return { success: true, msg: message, data: data };
        } catch (error) {
          console.log("Error: ", error);
          return { success: false, msg: error.message };
        }
    },


    getChatRooms: async (data) => {

        console.log(data);

        try {
            const findConversation = await chatConversation.find({ users: data.userId })
            // console.log('Chat rooms found >> ',findConversation)
            if (findConversation.length == 0) {
                const msfIfSuccess = "No data found";
                return { success: true, msg: msfIfSuccess, data: findConversation };
            }

            const msfIfSuccess = "ChatRooms found Successfully";
            return { success: true, msg: msfIfSuccess, data: findConversation };

        } catch (error) {

            console.log("Error : ", error);
            return { success: false, msg: error.message };
        }

    },


    getMsgsOnRooms: async (data) => {

        const { receiverId, roomId } = data;

        console.log('getMsgsOnRooms >>', roomId);

        const recever = await users.findOne({_id : receiverId});

        try {
            const findChat = await chatDetails.find({ roomId: data.roomId })
            // console.log('findChat found >> ',findChat)
            if (findChat.length == 0) {
                const msfIfSuccess = "No data found";
                return { success: true, msg: msfIfSuccess, };
            }

            const msfIfSuccess = "Chat found Successfully";
            return { success: true, msg: msfIfSuccess, data: findChat , user: recever };

        } catch (error) {

            console.log("Error : ", error);
            return { success: false, msg: error.message };
        }

    },

    getMsgs: async (req, res) => {

        var room = req.params.roomId;

        console.log('getMsgsOnRooms >>', room);

        try {
            const findChat = await chatDetails.find({ roomId: room })
            // console.log('findChat found >> ',findChat)
            if (findChat.length == 0) {
                const msfIfSuccess = "No data found";
                let responce = { success: false, msg: msfIfSuccess, data: findChat };
                res.status(201).send(responce);
            }

            const msfIfSuccess = "Chat found Successfully";
            let responce = { success: true, msg: msfIfSuccess, data: findChat };
            res.status(200).send(responce);


        } catch (error) {

            console.log("Error : ", error);
            return { success: false, msg: error.message };
        }

    },




    deleteSingleMsg: async (data) => {

        console.log(data);

        try {
            const findChat = await chatDetails.find({ roomId: data.roomId, _id: data.msgId })
            console.log('findChat found one chat to delete >> ', findChat)
            if (findChat.length == 0) {
                const msfIfSuccess = "No data found";
                return { success: false, msg: msfIfSuccess, data: findChat };
            }
            // Delete the item based on its _id and userId
            const deletionResult = await chatDetails.deleteOne({ _id: data.msgId, });

            if (deletionResult.deletedCount === 0) {
                const msgIfSuccess = "Item not found or not deletable";
                return { success: false, msg: msgIfSuccess };
            }

            const findChatComplete = await chatDetails.find({ roomId: data.roomId })
            const msfIfSuccess = "Chat Deleted Successfully";
            return { success: true, msg: msfIfSuccess, data: findChatComplete };

        } catch (error) {

            console.log("Error : ", error);
            return { success: false, msg: error.message };
        }

    },

}


