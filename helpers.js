const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// socket.off('getMessages', {roomId : "YOUR ROOM ID HERE"});