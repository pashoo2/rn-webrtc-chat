const uuid = require('uuid/v4');
const externalip = require('externalip');
let connections = []; // <{ userId, socket }>[]

externalip((err, extIp) => {
  if (err) {
    return console.error(err);
  }

  const config = require('./signal-server.conf.json');
  const io = require('socket.io')(config.port);

  console.log(`The server is available on ${extIp}:${config.port}`);
  io.on('connection', socket => {
    const userId = uuid();

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
