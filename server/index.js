const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

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

  socket.on('BE-join-room', ({ roomName, userName}) => {
    socket.join(roomName);

    socket.emit('join-room');
  });
});

http.listen(3001, () => {
  console.log('Connected : 3001');
});
