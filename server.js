const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });

    socket.on('offer', (id, description) => {
      socket.to(id).emit('offer', socket.id, description);
    });

    socket.on('answer', (id, description) => {
      socket.to(id).emit('answer', socket.id, description);
    });

    socket.on('ice-candidate', (id, candidate) => {
      socket.to(id).emit('ice-candidate', socket.id, candidate);
    });
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
