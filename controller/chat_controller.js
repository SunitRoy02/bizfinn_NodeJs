const { chatDetails, chatConversation } = require('../models/chat');
const users = require('../models/users')

const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}


module.exports = {
    sendMessage: async (data) => {

        console.log(data);

        try {

            const userArray = [data.senderId, data.receiverId]

            const userData1 = await users.findOne({ _id: userArray[0] });
            const userData2 = await users.findOne({ _id: userArray[1] });
            const userParticipants = [userData1, userData2]

            const uniqueId = uid();
            if (data.roomid == undefined || data.roomId == '' || data.roomId == null) {

                // const findConversation = await chatConversation.find({ roomId: data.roomId })
                // console.log('Chat rooms found >> ', findConversation)
                
                let convoData = {
                    users: userArray,
                    participants: userParticipants,
                    messages : data.contentType == 2 ? "Image" : data.content,
                    roomId : uniqueId
                }

                data.roomId = convoData.roomId;
                let convoObj = new chatConversation(convoData)
                let convoResult = await convoObj.save();
                

            } 

            let dataObj = new chatDetails(data);
            let result = await dataObj.save();
            const msfIfSuccess = "Message Sent Successfully";
            return { success: true, msg: msfIfSuccess, data: data };

        } catch (error) {
            console.log("Error : ", error);
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

        console.log('getMsgsOnRooms >>', data.roomId);

        try {
            const findChat = await chatDetails.find({ roomId: data.roomId })
            // console.log('findChat found >> ',findChat)
            if (findChat.length == 0) {
                const msfIfSuccess = "No data found";
                return { success: true, msg: msfIfSuccess, data: findChat };
            }

            const msfIfSuccess = "Chat found Successfully";
            return { success: true, msg: msfIfSuccess, data: findChat };

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


