const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3001;
const path = require('path');

let socketList = {};

app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Route
app.get('/ping', (req, res) => {
  res
    .send({
      success: true,
    })
    .status(200);
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


// Socket
io.on('connection', (socket) => {
  console.log('User Connected!!', socket.id, new Date().toLocaleDateString());

  socket.on('disconnect', () => {
    console.log('User disconnected!');
  });

  socket.on('BE-check-user', ({ roomId, userName }) => {
    let error = false;
    io.sockets.in(roomId).clients((err, clients) => {
      clients.forEach((client) => {
        if (socketList[client] == userName) {
          error = true;
        }
      });
      socket.emit('FE-error-user-exist', { error });
    });
  });

  /**
   * Join Room
   */
  socket.on('BE-join-room', ({ roomId, userName }) => {
    // Socket Join RoomName
    socket.join(roomId);
    socketList[socket.id] = userName;

    // Set User List
    io.sockets.in(roomId).clients((err, clients) => {
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
            socket.leave(roomId);
            delete socketList[socket.id];

            throw {
              msg: 'User Name not available',
            };
          }
        });
        io.sockets.in(roomId).emit('FE-user-join', users);
      } catch (e) {
        io.sockets.in(roomId).emit('FE-error-user-exist', { err: e.msg });
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

  socket.on('BE-send-message', ({ roomId, msg, sender }) => {
    console.log(sender, msg, roomId);
    io.sockets.in(roomId).emit('FE-receive-message', { msg, sender });
  });
});

http.listen(PORT, () => {
  console.log('Connected : 3001');
});
