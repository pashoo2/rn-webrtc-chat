const config = require('./signal-server.conf.json');
const app = require('http').createServer(() => {});
const uuid = require('uuid/v4');
const externalip = require('externalip');
let connections = []; // <{ userId, socket }>[]

externalip((err, extIp) => {
  if (err) {
    console.error(err);
  }

  const io = require('socket.io')(app);

  app.listen(config.port, '127.0.0.1', () => {
    console.log(`The server is available on 127.0.0.1:${config.port}`);
  });
  io.on('connection', socket => {
    const userId = uuid();

    console.info(`new connection with the user ${userId}`);
    connections.push({
      userId,
      socket,
    });
    socket.emit('user::set::id', userId);
    socket.on('disconnect', function() {
      connections = connections.filter(
        ({ userId: connectionUserId }) => connectionUserId !== userId
      );
      socket.broadcast.emit('user::disconnected', userId);
    });
  });
});
