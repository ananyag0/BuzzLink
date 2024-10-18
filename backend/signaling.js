const socketio = require('socket.io');

/**
 * workflow of a call from A to B
 * A: call_request -> server
 * server: call_request -> B
 * B: call_accept -> server
 * server: call_start -> A/B
 * A: offer -> server
 * server: offer -> B
 * B: answer -> server
 * server: answer -> A
 * 
 * */
function setupSignalingServer(server) {
  const io = new socketio.Server(server, {
    cors: {
      origin: '*'
    }
  });

  io.on('connection', socket => {
    console.log('a connection of socket');

    socket.on('join', userID => {
      socket.join(userID);
    });

    socket.on('call_request', body => {
      const { fromID, toID } = body;
      io.to(toID).emit('call_request', fromID);
    }); 

    socket.on('call_accept', body => {
      const { fromID, toID } = body;
      io.to([fromID, toID]).emit('call_start', body);
    });

    socket.on('call_reject', body => {
      io.to([body.fromID, body.toID]).emit('call_reject', body);
    });

    socket.on('offer', body => {
      io.to(body.toID).emit('offer', body);
    });

    socket.on('answer', body => {
      io.to(body.fromID).emit('answer', body);
    });

    socket.on('candidate', (toWhom, candidate) => {
      io.to(toWhom).emit('candidate', candidate);
    });

  });
  return io;
}

module.exports = setupSignalingServer;
