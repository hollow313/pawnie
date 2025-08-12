const next = require('next');
const http = require('http');
const { Server } = require('socket.io');
const { parse } = require('cookie');
const jwt = require('jsonwebtoken');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, hostname: '0.0.0.0', port: process.env.PORT || 3000 });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => handle(req, res));
  const io = new Server(server, { path: '/socket.io' });

  io.use((socket, nextMw) => {
    try {
      const cookie = socket.handshake.headers.cookie || '';
      const token = parse(cookie)['token'];
      if (!token) return nextMw(new Error('unauthorized'));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.uid = payload.sub;
      nextMw();
    } catch (e) {
      nextMw(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const uid = socket.data.uid;
    socket.join(`user:${uid}`);
  });

  global.io = io;

  const port = parseInt(process.env.PORT || '3000', 10);
  server.listen(port, '0.0.0.0', () => {
    console.log(`Pawnie is running on :${port}`);
  });
});
