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
    console.log('User connected');
  
    socket.on('createMessage', async  (data) => {
       var result = await  chatController.sendMessage(data);
        io.emit('newCreatedMessage', result);
        try {
            // var rooms = await chatController.getChatRooms();
            // io.emit('listOfRooms', rooms);
          } catch (error) {
            console.error('Error:', error);
          }
       
    });

    socket.on('getChatRooms', async  (data) => {

        var result = await  chatController.getChatRooms(data);
        // console.log(result);
         io.emit('listOfRooms', result);
     });

  
     socket.on('getMessages', async  (data) => {

        var result = await  chatController.getMsgsOnRooms(data);
        // console.log(result);
         io.emit('getMessagesOfRoom', result);
     });

     socket.on('deleteSingleMsg', async  (data) => {

        var result = await  chatController.deleteSingleMsg(data);
        // console.log(result);
         io.emit('getMessagesOfRoom', result);
     });

    socket.on('disconnect', () => console.log('User disconnected'));
  });

  return io;
}

 
