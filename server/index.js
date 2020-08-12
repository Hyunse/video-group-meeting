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
    io.in(roomName).clients((err, clients) => {
      try {
        const users = [];
        clients.forEach((client) => {
          if (
            client !== socket.id &&
            socketList[client] &&
            socketList[client] !== userName
          ) {
            // Add User List
            users.push({ socketId: client, userName: socketList[client] });
          } else if (client !== socket.id && socketList[client] == userName) {
            // Found Same User Name..
            socket.leave(roomName);
            delete socketList[socket.id];
            
            throw {
              msg: 'User Name not available'
            };
          }
        });

        console.log(users);
        io.sockets.in(roomName).emit('FE-user-join', { roomName, users });
      } catch (e) {
        socket.emit('FE-error-user-exist', { err: e.msg });
      }
    });
  });
});

http.listen(3001, () => {
  console.log('Connected : 3001');
});
