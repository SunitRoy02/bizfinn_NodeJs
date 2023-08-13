const {chatDetails , chatConversation} = require('../models/chat');
const users = require('../models/users')




module.exports = {
    sendMessage : async (data) => {

        console.log(data);

        try {

            const userArray = [data.senderId,data.receiverId]
            const userParticipants = await users.find({users : { $all: userArray }})
            const findConversation = await chatConversation.find({users : { $all: userArray }})
            // console.log('Chat rooms found >> ',findConversation)

            if(findConversation.length == 0){


                const usersArray = [data.senderId,data.receiverId]

                let convoData = {
                    users : userArray,
                    participants : userParticipants
                }

                let convoObj = new chatConversation(convoData)
                let convoResult = await convoObj.save();

                // console.log(convoResult);
                data.roomId = convoResult._id;
                // console.log(convoResult._id);
            }else{
                data.roomId = findConversation[0]._id;

            }
        
            let dataObj = new chatDetails(data);
            let result = await dataObj.save();

            const msfIfSuccess = "Message Sent Successfully";
            return { success: true, msg: msfIfSuccess, data: result };

        } catch (error) {
            console.log("Error : ", error);
            return { success: false, msg: error.message };
        }

    },


    getChatRooms : async (data) => {

        console.log(data);

        try {
            const findConversation = await chatConversation.find({users : data.userId})
            // console.log('Chat rooms found >> ',findConversation)
            if(findConversation.length == 0){
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


    getMsgsOnRooms : async (data) => {

        console.log(data);

        try {
            const findChat = await chatDetails.find({roomId : data.roomId})
            console.log('findChat found >> ',findChat)
            if(findChat.length == 0){
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
 

}


