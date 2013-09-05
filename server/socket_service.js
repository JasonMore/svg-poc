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
    socket.on('pageSave', function (page, doneFn) {
      socket.broadcast.emit('pageUpdated', page);
      connect(function(db) {
        db.collection('pages').save(page, function(err, savedPage){
          doneFn(savedPage);
        });
      });

    });
  }

  return this;
}

module.exports = socketService();