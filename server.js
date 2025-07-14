const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();

// ✅ Enable CORS for your InfinityFree domain
app.use(cors({
  origin: 'https://thebate.ct.ws',
  methods: ['GET', 'POST'],
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://thebate.ct.ws',
    methods: ['GET', 'POST']
  }
});

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('join-room', room => {
    socket.join(room);
    socket.to(room).emit('user-joined', socket.id);

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
    });
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
