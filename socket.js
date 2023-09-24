const socketIO = require('socket.io');
const chatController = require('./controller/chat_controller')

module.exports = function initializeSocket(server) {


  // Create a socket.io instance and attach it to the server
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});


  io.on('connection', (socket) => {
    console.log('User connected ');
  
    socket.on('createMessage', async  (data) => {
       var result = await  chatController.sendMessage(data);

        console.log("Result >> ", result);
        if(result.success){
          try {
            var result = await  chatController.getMsgsOnRooms(result.data);
            // console.log(result);
             io.emit('getMessagesOfRoom', result);
          } catch (error) {
            console.error('Error:', error);
          }
        }
        
    });

    socket.on('getChatRooms', async  (data) => {
        var result = await  chatController.getChatRooms(data);
         io.emit('listOfRooms', result);
     });

  
     socket.on('getMessages', async  (data) => {
        var result = await  chatController.getMsgsOnRooms(data);
         io.emit('getMessagesOfRoom', result);
     });

     socket.on('deleteSingleMsg', async  (data) => {
        var result = await  chatController.deleteSingleMsg(data);
         io.emit('getMessagesOfRoom', result);
     });

     socket.on('deleteConversation', async  (data) => {
      var result = await  chatController.deleteChatRoom(data);
       io.emit('msgListner', result);
   });

    socket.on('disconnect', () => console.log('User disconnected'));
  });

  return io;
}

 
