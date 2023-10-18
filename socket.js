const socketIO = require('socket.io');
const chatController = require('./controller/chat_controller')
let users = []
module.exports = function initializeSocket(server) {


  // Create a socket.io instance and attach it to the server
  const io = socketIO(server, {
    cors: {
      origin: "*",
    },
  });


  io.on('connection', (socket) => {
    console.log('User connected ');

    socket.on('joinUser', user => {
      console.log(user)
      users.push({ _id: user._id, socketId: socket.id })
      console.log(users)
    })

    socket.on('disconnect',async () => { 
      const data =await users.find(user => user.socketId === socket.id)
      console.log("disconnected" , data)
      users = users.filter(user => user.socketId !== socket.id)
      console.log(users)
  })

    socket.on('createMessage', async (data) => {
      var result = await chatController.sendMessage(data);
      const user = await users.find(user => user._id === data.receiverId)

      console.log("Result >> ", result);
      if (result.success) {
        try {
          var result = await chatController.getMsgsOnRooms(result.data);
          // console.log(result);
          io.to(`${user.socketId}`).emit('getMessagesOfRoom', result);
        } catch (error) {
          console.error('Error:', error);
        }
      }

    });

    socket.on('getChatRooms', async (data) => {
      var result = await chatController.getChatRooms(data);
      io.emit('listOfRooms', result);
    });


    socket.on('getMessages', async (data) => {
      var result = await chatController.getMsgsOnRooms(data);
      const user = await users.find(user => user._id === result.user._id)
      io.to(`${user.socketId}`).emit('getMessagesOfRoom', result);
    });

    socket.on('deleteSingleMsg', async (data) => {
      var result = await chatController.deleteSingleMsg(data);
      io.to().emit('getMessagesOfRoom', result);
    });

    socket.on('deleteConversation', async (data) => {
      var result = await chatController.deleteChatRoom(data);
      io.emit('msgListner', result);
    });

    socket.on('disconnect', () => console.log('User disconnected'));
  });

  return io;
}


