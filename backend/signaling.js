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
 * candidate is also exchanged during the process:
 * A/B: candidate -> server
 * server: candidate -> B/A
 * 
 * */
function setupSignalingServer(server) {
  const io = new socketio.Server(server, {
    cors: {
      origin: '*'
    }
  });

  const userList = [];
  const pairs = new Map();

  io.on('connection', socket => {
    console.log('Connectin from a client');

    socket.on('join', userID => {
      socket.join(userID);
      socket.userID = userID;
      socket.emit('current_users', userList);
      io.except(userID).emit('peer_join', userID);
      userList.push(userID);
    });

    socket.on('call_request', body => {
      io.to(body.toID).emit('call_request', body);
    }); 

    socket.on('call_accept', body => {
      const { fromID, toID } = body;
      pairs.set(fromID, toID);
      pairs.set(toID, fromID);
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

    socket.on('communication_stop', (communicators) => {
      for (const one of communicators) {
        pairs.delete(one);
      }
      io.to(communicators).emit('communication_stop');
    });

    socket.on('disconnect', () => {
      const another = pairs.get(socket.userID);
      pairs.delete(socket.userID);
      pairs.delete(another);
      console.log(`the user ${socket.userID} has disconnected`);
      io.except(socket.userID).emit('peer_leave', socket.userID);
      io.to(another).emit('communication_stop');
    });

  });
  return io;
}

module.exports = setupSignalingServer;
