const rooms = {};

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('join-room', room => {
    socket.join(room);
    if (!rooms[room]) rooms[room] = [];
    rooms[room].push(socket.id);

    // Send back list of all existing users in room (excluding the new one)
    const otherUsers = rooms[room].filter(id => id !== socket.id);
    socket.emit('user-list', otherUsers);

    socket.on('offer', ({ to, offer }) => {
      socket.to(to).emit('offer', { from: socket.id, offer });
    });

    socket.on('answer', ({ to, answer }) => {
      socket.to(to).emit('answer', { from: socket.id, answer });
    });

    socket.on('ice-candidate', ({ to, candidate }) => {
      socket.to(to).emit('ice-candidate', { from: socket.id, candidate });
    });

    socket.on('disconnect', () => {
      socket.to(room).emit('user-left', socket.id);
      if (rooms[room]) {
        rooms[room] = rooms[room].filter(id => id !== socket.id);
        if (rooms[room].length === 0) delete rooms[room];
      }
    });
  });
});
