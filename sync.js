var murmurhash = require('./media/murmurhash.js');

console.log("Murmurhash {}:", murmurhash({}));

var sync = function(io){

  /*
   * Wraps the socket object;
   * Every time a callback is triggered, first log that callback
   * and its arguments.
   */
  var logEvents = function(socket, guid){
    var originalOn = socket.on;
    var originalEmit = socket.emit;
    socket.on = function(){
      var argumentsArray = [].slice.apply(arguments);
      var callback = argumentsArray[1];

      var loggingWrapper = function(){
        var innerArgumentsArray = [].slice.apply(arguments);
        var incoming_event = "Incoming Event:"+guid+":"+argumentsArray[0];
        console.log(incoming_event.magenta, innerArgumentsArray.toString());
        callback.apply(this, innerArgumentsArray);
      }

      argumentsArray[1] = loggingWrapper;

      originalOn.apply(this, argumentsArray)
    }
    socket.emit = function(){
      var argumentsArray = [].slice.apply(arguments);
      var event = argumentsArray[0];
      var message = argumentsArray[1];

      var outgoing_event = "Emitting Event:"+guid+":"+event;
      console.log(outgoing_event.cyan, message);

      originalEmit.apply(this, argumentsArray)
    }
  }
  logEvents(io);

  var exp = {};

  /* maintain a key-value list of all data elements we're syncing */
  /* where the key is the data element
   * and the value is the hash of the data in that element. */
  var hash_list = {};
  var data_list = {};

  exp.setItem = function(key, data){
    var hash = murmurhash(data);
    hash_list[key] = hash;
    data_list[key] = data;
    io.emit("UPDATE", key, JSON.stringify(data));
  };

  exp.getItem = function(key){
    return data_list[key];
  }

  exp.removeItem = function(key){
    delete hash_list[key];
    delete data_list[key];
    io.emit("REMOVE", key);
  };


  var list_of_connections = [];
  io.on('connection', function(socket){
    console.log('sync: An unknown user connected.');
    socket.on('GUID', function(msg){
      console.log(msg);
      list_of_connections.push(msg);
      logEvents(socket, msg);
      socket.emit("WELCOME", msg);
      exp.setItem("list_of_connections", list_of_connections);
    });
    socket.on('DIFF', function(hash_list){
      /* a list of keys and hashes. we compare with our current list
       * and send any updates. */
      _.forEach(hash_list, function(item){
        console.log(item.blue);
      });
    });
    socket.on('REQUEST', function(key){
      /* request a key from the server */
    });
    socket.on('UPDATE', function(key, data){
      /* a server has sent in new information against a key */
      var hash = murmurhash(data);
      hash_list[key] = hash;
      data_list[key] = data;
    });
    socket.on('disconnect', function(msg){
      console.log('sync: user disconnected: ' + msg);
    });
  });

  return exp;
}


module.exports = sync;
