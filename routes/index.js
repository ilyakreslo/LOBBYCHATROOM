var checkAuth = require('middleware/checkAuth');
var chat = require('./chat');

module.exports = function(app) {

  app.get('/', require('./frontpage').get);

  app.get('/login', require('./login').get);
  app.post('/login', require('./login').post);

  app.post('/logout', require('./logout').post);

  app.post('/chat/rooms/new', checkAuth, chat.newRoom);

  app.get('/chat/users', checkAuth, chat.getAllUsers);
  app.get('/chat/rooms', checkAuth, chat.getUserRooms);
  app.get('/chat', checkAuth, chat.get);

};
