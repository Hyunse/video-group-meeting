const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
let socketList = {};

// Route
app.get('/', (req, res) => {
  res
    .send({
      success: true,
    })
    .status(200);
});

// Socket
io.on('connection', (socket) => {
  console.log('User Connected!!', socket.id, new Date().toLocaleDateString());

  socket.on('disconnect', () => {
    console.log('User disconnected!');
  });

  /**
   * Join Room
   */
  socket.on('BE-join-room', ({ roomName, userName }) => {
    // Socket Join RoomName
    socket.join(roomName);
    socketList[socket.id] = userName;

    // Set User List
    io.sockets.in(roomName).clients((err, clients) => {
      try {
        const users = [];
        clients.forEach((client) => {
          if (
            client !== socket.id &&
            socketList[client] &&
            socketList[client] !== userName
          ) {
            // Add User List
            users.push({ userId: client, userName: socketList[client] });
          } else if (client !== socket.id && socketList[client] == userName) {
            // Found Same User Name..
            socket.leave(roomName);
            delete socketList[socket.id];

            throw {
              msg: 'User Name not available',
            };
          }
        });

        socket.emit('FE-user-join', { roomName, users });
        socket.broadcast
          .to(roomName)
          .emit('FE-new-user', { socketId: socket.id, userName });
      } catch (e) {
        socket.emit('FE-error-user-exist', { err: e.msg });
      }
    });
  });

  socket.on('BE-call-user', ({ userToCall, from, signal }) => {
    io.to(userToCall).emit('FE-receive-call', {
      signal,
      from,
    });
  });

  socket.on('BE-accept-call', ({ signal, to }) => {
    io.to(to).emit('FE-call-accepted', {
      signal,
      answerId: socket.id,
    });
  });
});

http.listen(3001, () => {
  console.log('Connected : 3001');
});
