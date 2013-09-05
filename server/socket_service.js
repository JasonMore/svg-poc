var io = require('socket.io'),
  mongo = require('mongoskin');

var socketService = function() {
  var db;

  this.start = function(server) {
    checkIfMongoIsSetup();

    io = io.listen(server, {
      'flash policy port': -1
    });

//    var io = require('socket.io').listen(3000, {
//      'flash policy port': -1
//  });

    io.set('transports', ['flashsocket']);

    io.sockets.on('connection', connectionEvents);
  }

  function checkIfMongoIsSetup(){
    // query for table?
  }

  function connect(next) {
    db = mongo.db("localhost/svgPoc", {safe: true});
    next(db);
  }

  function connectionEvents(socket){
    socket.on('pageSave', function (page) {
      socket.broadcast.emit('pageUpdated', page);
//      db.collection('pages').save(page);
    });
  }

  return this;
}

module.exports = socketService();