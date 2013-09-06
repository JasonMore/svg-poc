var io = require('socket.io'),
  mongo = require('mongoskin');

var socketService = function() {
  this.start = function(server) {
    checkIfMongoIsSetup();

    io = io.listen(server);
    io.sockets.on('connection', connectionEvents);
  }

  function checkIfMongoIsSetup(){
    // query for table?
  }

  function connect(next) {
    var db = mongo.db("localhost/svgPoc", {safe: true});
    next(db);
  }

  function connectionEvents(socket){
    socket.on('shapeUpdate', function (shape, doneFn) {
      socket.broadcast.emit('shapeUpdated', shape);
//      connect(function(db) {
//        db.collection('pages').save(page, function(err, savedPage){
//          doneFn(savedPage);
//        });
//      });

    });

    socket.on('shapeAdd', function(shape){
      socket.broadcast.emit('shapeAdded', shape);
    });

    socket.on('shapeDelete', function(shapeId) {
      socket.broadcast.emit('shapeDeleted', shapeId);
    });
  }

  return this;
}

module.exports = socketService();