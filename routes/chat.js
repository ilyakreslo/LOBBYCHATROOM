var log = require('lib/log')(module);
var User = require('models/user').User;
var Room = require('models/room').Room;
var HttpError = require('error').HttpError;

exports.get = function(req, res) {
  res.render('chat');
};

exports.getUserRooms = function(req, res, next) {
  var userId = req.session.user;

  User.findById(userId, "rooms", function (err, result) {
    if (err) {
      log.error(err);
      res.status(500);
      return res.send(err);
    }
    if (!result) {
      res.status(400);
      return res.end();
    }

    res.send(result.rooms);
  });
};

exports.newRoom = function(req, res, next) {
  var newRoomName = req.body.roomName;
  if (!newRoomName || newRoomName.length > 32 || newRoomName !== newRoomName.replace(/[^\w\d\s*.,!?ёЁА-я-]/g, '')) {
    return next(new HttpError(400, "It is not possible to create a room with this name."));
  }

  var user = req.session.user;
  User.findById(user, function(err, user) {
    if (err) return next(new HttpError(500, err));
    if (!user) return next(new HttpError(401));

    var username = user.username;

    var room = user.rooms.filter(function (room) {
      return room.roomName === newRoomName;
    }).pop();

    if (room) return next(new HttpError(400, "It is not possible to create a room with this name."));

    room = new Room({roomName: newRoomName, users: [username]});
    room.save(function(err, room) {
      if (err) return next(new HttpError(500, err));
      user.rooms.push(room);
      user.save(function(err) {
        if (err) return next(new HttpError(500, err));

        res.send(room);
      });
    });
  });
};

/**
 * Возвращает список всех пользователей чата.
 * @param req
 * @param res
 * @param next
 */
exports.getAllUsers = function (req, res, next) {
  User.find({}, "username -_id", {"username" : 1}, function(err, users) {
    if (err) return next(err);
    res.send(users);
  })
};