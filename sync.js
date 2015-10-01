var murmurhash = require('./media/murmurhash.js');

console.log("Murmurhash {}:", murmurhash({}));

var sync = function(io, options){
  if(typeof(options) === 'undefined'){
    options = {}
  }

  /*
   * Wraps the socket object;
   * Every time a callback is triggered, first log that callback
   * and its arguments.
   */
  var logEvents = function(socket){
    var originalOn = socket.on;
    var originalEmit = socket.emit;
    socket.on = function(){
      var argumentsArray = [].slice.apply(arguments);
      var callback = argumentsArray[1];

      var loggingWrapper = function(){
        var innerArgumentsArray = [].slice.apply(arguments);
        console.log("Incoming Event".magenta, argumentsArray[0].magenta, innerArgumentsArray.toString());
        callback.apply(this, innerArgumentsArray);
      }

      argumentsArray[1] = loggingWrapper;

      originalOn.apply(this, argumentsArray)
    }
    socket.emit = function(){
      var argumentsArray = [].slice.apply(arguments);
      var event = argumentsArray[0];
      var message = argumentsArray[1];

      console.log("Emitting Event".cyan, event.cyan, message);

      originalEmit.apply(this, argumentsArray)
    }
  }
  logEvents(io);

  var exp = {};

  exp.syncList = function(){
    /* maintain a key-value list of all data elements we're syncing */
    /* where the key is the data element
     * and the value is the hash of the data in that element. */
    var hash_list = {};
    var data_list = {};

    var addKey = function(key, data){
      var hash = murmurhash(data);
      hash_list[key] = hash;
      data_list[key] = data;
      io.emit("UPDATE", key, hash, JSON.stringify(data));
    };

    var removeKey = function(key){
      delete hash_list[key];
      delete data_list[key];
      io.emit("REMOVE", key);
    };

    var loadEvents = function(socket){
      socket.on('DIFF', function(msg){
        /* a list of keys and hashes. we compare with our current list
         * and send any updates. */

      });
      socket.on('REQUEST', function(msg){
        /* request a key from the server */
      });
      socket.on('UPDATE', function(msg){
        /* a server has sent in new information against a key */

      });

    };

  };

  var list_of_connections = [];
  io.on('connection', function(socket){
    console.log('sync: An unknown user connected.');
    logEvents(socket);
    socket.on('GUID', function(msg){
      console.log(msg);
      list_of_connections.push(msg);
      socket.emit("WELCOME", msg);
    });
    socket.on('disconnect', function(msg){
      console.log('sync: user disconnected: ' + msg);
    });
  });

  return exp;
}


module.exports = sync;
